import { PrismaClient } from "@prisma/client";
import retry from "promise-retry";

export const prisma = new PrismaClient();

export const connectDB = () => {
  return retry(
    async (retry, number) => {
      console.log(`Conectando a la base de datos (intento ${number}/3)...`);
      try {
        await prisma.$connect();
        console.log(`📁 Base de datos conectada`);
      } catch (err) {
        console.error(`❌ Error al conectar a la base de datos`, err);
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
