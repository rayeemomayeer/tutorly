import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { ac, adminRole, studentRole, tutorRole } from "./permissions";
import { admin as adminPlugin } from "better-auth/plugins"

export const auth = betterAuth({
  appName: "Tutorly",

  baseUrl: process.env.APP_URL || "http://localhost:4000",

  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    adminPlugin({
      ac,
      adminRoles: ["admin"],
      defaultRole: "student",
      roles: {
        admin: adminRole,
        student: studentRole,
        tutor: tutorRole,

      },

    }),

  ]

});