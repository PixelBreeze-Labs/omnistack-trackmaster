// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  authPrisma: PrismaClient;
};

// Standard client for general operations
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasources: {
      db: {
        url: process.env.MONGODB_URI,
      },
    },
  });

// Special client for auth operations with primary read preference
export const authPrisma =
  globalForPrisma.authPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    datasources: {
      db: {
        // Force primary reads for auth operations by adding readPreference
        url: process.env.MONGODB_URI?.includes('?') 
          ? `${process.env.MONGODB_URI}&readPreference=primary&readConcernLevel=majority` 
          : `${process.env.MONGODB_URI}?readPreference=primary&readConcernLevel=majority`,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.authPrisma = authPrisma;
}