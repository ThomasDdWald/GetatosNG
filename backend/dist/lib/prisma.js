import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
function requireEnv(name, value) {
    const trimmed = value?.trim();
    if (!trimmed) {
        throw new Error(`${name} is missing`);
    }
    return trimmed;
}
function optionalEnv(value) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}
function maskDatabaseUrl(url) {
    return url.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
}
function buildSocketPath() {
    const instanceUnixSocket = optionalEnv(process.env.INSTANCE_UNIX_SOCKET);
    if (instanceUnixSocket) {
        return instanceUnixSocket.startsWith('/')
            ? instanceUnixSocket
            : `/${instanceUnixSocket}`;
    }
    const instanceConnectionName = optionalEnv(process.env.INSTANCE_CONNECTION_NAME);
    if (instanceConnectionName) {
        return `/cloudsql/${instanceConnectionName}`;
    }
    return undefined;
}
function buildDatabaseUrl() {
    const existingUrl = optionalEnv(process.env.DATABASE_URL);
    if (existingUrl) {
        return existingUrl;
    }
    const dbUser = requireEnv('DB_USER', process.env.DB_USER);
    const dbPass = requireEnv('DB_PASS', process.env.DB_PASS);
    const dbName = optionalEnv(process.env.DB_NAME) ?? 'getatos_safari';
    const socketPath = buildSocketPath();
    if (socketPath) {
        const params = new URLSearchParams({
            host: socketPath,
            schema: 'public'
        });
        return `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPass)}@localhost/${encodeURIComponent(dbName)}?${params.toString()}`;
    }
    const dbHost = optionalEnv(process.env.DB_HOST) ?? 'localhost';
    const dbPort = optionalEnv(process.env.DB_PORT) ?? '5432';
    const params = new URLSearchParams({
        schema: 'public'
    });
    return `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPass)}@${dbHost}:${dbPort}/${encodeURIComponent(dbName)}?${params.toString()}`;
}
const databaseUrl = buildDatabaseUrl();
process.env.DATABASE_URL = databaseUrl;
console.log('DATABASE_URL:', maskDatabaseUrl(databaseUrl));
function createPrismaClient() {
    return new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl
            }
        },
        log: ['warn', 'error']
    });
}
export const prisma = globalThis.__prisma__ ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma__ = prisma;
}
export async function connectPrisma() {
    await prisma.$connect();
    console.log('Prisma connected successfully');
}
export async function disconnectPrisma() {
    await prisma.$disconnect();
}
export default prisma;
//# sourceMappingURL=prisma.js.map