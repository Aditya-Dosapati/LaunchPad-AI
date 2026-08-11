import { PrismaClient } from '@prisma/client';

// ---------------------------------------------------------------------------
// Singleton Prisma Client
// ---------------------------------------------------------------------------
// In development, hot-reloading can create multiple PrismaClient instances.
// We cache the client on `globalThis` so only one connection pool exists
// across the entire Node.js process lifetime.
// In production, the module-level `prisma` variable is sufficient.
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
