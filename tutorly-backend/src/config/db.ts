import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "./env";

const connectionString = config.databaseUrl!;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export { prisma };