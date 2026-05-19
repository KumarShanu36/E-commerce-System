import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis;

const getPrismaClient = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
