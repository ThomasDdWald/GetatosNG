import 'dotenv/config';
import { type Express } from 'express';
import prisma from './lib/prisma.js';
declare const app: Express;
export { app, prisma };
export default app;
//# sourceMappingURL=index.d.ts.map