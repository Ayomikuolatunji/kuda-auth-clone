import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["info", "warn","error"],
  errorFormat: "colorless",
  rejectOnNotFound: false,
});

export default prisma;
