import express from 'express';
const app = express();
const PORT = Number(process.env.PORT) || 8080;
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on port ${PORT}`);
});
//# sourceMappingURL=test-server.js.map