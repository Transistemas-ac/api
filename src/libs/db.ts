import { PrismaClient } from "@prisma/client";
import retry from "promise-retry";

export const prisma = new PrismaClient();

export const connectDB = () => {
  return retry(
    async (retry, number) => {
      console.log(`⚙️ Connecting to database (attempt ${number}/3)...`);
      try {
        await prisma.$connect();
        console.log(`📁 Database connected`);
      } catch (err) {
        console.error(`🔴 Database connection error`, err);
        retry(err);
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 20000,
    }
  );
};
