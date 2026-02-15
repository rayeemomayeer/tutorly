
import axios from "axios";
import crypto from "crypto";
import { prisma } from "src/lib/prisma";


async function main() {
  console.log("Seeding database...");


  const API_URL = `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`;

  // Admin 
  const adminEmail = "admin@tutorly.com";
  const adminPassword = "AdminPass123!";

  try {
    const { data: adminData } = await axios.post(API_URL, {
      name: "Super Admin",
      email: adminEmail,
      password: adminPassword,
    });
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "admin" },
    });


    console.log("Admin user seeded via Better Auth:", adminData.email);
  } catch (err: any) {
    console.error(
      " Error seeding admin:",
      err.response?.data || err.message
    );
  }



  console.log("🌱 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
