import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
declare global {
    var __prisma__: PrismaClient | undefined;
}
export declare const prisma: PrismaClient;
export declare function connectPrisma(): Promise<void>;
export declare function disconnectPrisma(): Promise<void>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map