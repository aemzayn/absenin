import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export default db;
