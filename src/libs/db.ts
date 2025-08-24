import { PrismaClient } from "@prisma/client";
import retry from "promise-retry";

export const prisma = new PrismaClient();

export const connectDB = () => {
  return retry(
    async (retry, number) => {
      console.log(`⚙️  Connecting to database (attempt ${number})...`);
      try {
        await prisma.$connect();
        console.log(
          `📁 Database connected (attempt ${number}) \n`,
          process.env.DB_URL
        );
      } catch (err) {
        console.error(
          `🔴 Database connection error (attempt ${number})\n`,
          err
        );
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
