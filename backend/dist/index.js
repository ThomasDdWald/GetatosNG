import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import prisma, { connectPrisma, disconnectPrisma } from './lib/prisma.js';
import { initFirebase } from './services/firebaseAuth.js';
// Firebase initialisieren beim Serverstart
initFirebase();
const app = express();
const PORT = Number(process.env.PORT) || 8080;
// CORS konfigurieren - erlaubte Origins
const corsOptions = {
    origin: [
        'https://getatos-frontend-867468173620.africa-south1.run.app',
        'https://getatos-safari.com',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
// Serve static files from uploaded images
// Use process.cwd() which is /app in Docker
const publicDir = path.join(process.cwd(), 'public', 'images');
console.log('Serving static images from:', publicDir);
// Only serve static files if directory exists
if (fs.existsSync(publicDir)) {
    app.use('/images', express.static(publicDir));
}
app.get('/api/health', async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.status(200).json({
            status: 'ok',
            database: 'connected'
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown database error';
        console.error('Health check DB error:', error);
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            details: message
        });
    }
});
app.get('/api/db-test', async (_req, res) => {
    try {
        const tourCount = await prisma.tour.count();
        res.status(200).json({
            status: 'connected',
            tourCount
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown database error';
        console.error('DB test error:', error);
        res.status(500).json({
            error: 'DB connection failed',
            details: message
        });
    }
});
async function loadRoute(name, routePath) {
    try {
        const module = await import(`./routes/${name}.js`);
        const router = module.default;
        app.use(routePath, router);
        console.log(`Loaded ${name}`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown route load error';
        console.error(`Failed to load ${name}:`, message);
    }
}
async function loadRoutes() {
    await loadRoute('tours', '/api/tours');
    await loadRoute('bookings', '/api/bookings');
    await loadRoute('blog', '/api/posts');
    await loadRoute('testimonials', '/api/testimonials');
    await loadRoute('newsletter', '/api/newsletter');
    await loadRoute('gallery', '/api/gallery');
    await loadRoute('translations', '/api/translations');
    await loadRoute('contact', '/api/contact');
    await loadRoute('admin', '/api/admin');
    await loadRoute('settings', '/api/settings');
    await loadRoute('payment', '/api/payment');
    await loadRoute('upload', '/api/upload');
}
async function startServer() {
    try {
        await connectPrisma();
    }
    catch (error) {
        console.error('Prisma connection failed on startup:', error);
    }
    await loadRoutes();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}
async function shutdown(signal) {
    try {
        console.log(`Received ${signal}, shutting down gracefully...`);
        await disconnectPrisma();
    }
    catch (error) {
        console.error('Error during Prisma disconnect:', error);
    }
    finally {
        process.exit(0);
    }
}
process.on('SIGINT', () => {
    void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
});
void startServer();
export { app, prisma };
export default app;
//# sourceMappingURL=index.js.map