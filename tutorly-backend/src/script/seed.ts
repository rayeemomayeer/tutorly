
import axios from "axios";
import crypto from "crypto";
import { prisma } from "src/lib/prisma";


async function main() {
  console.log("Seeding database...");

  // Categories
  const categories = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "Programming" },
    { name: "English" },
    { name: "History" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }

  console.log(" Categories seeded");

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

  // Tutor 
  const tutorEmail = "tutor@tutorly.com";
  const tutorPassword = "TutorPass123!";

  try {
    const { data: tutorData } = await axios.post(API_URL, {
      name: "John Doe",
      email: tutorEmail,
      password: tutorPassword
    });
    const tutorUser = await prisma.user.findUnique({
      where: { email: tutorEmail },
    });

    if (!tutorUser) throw new Error("Tutor user not found after registration");


    await prisma.user.update({
      where: { email: tutorEmail },
      data: { role: "tutor" },
    });



    //  TutorProfile
    await prisma.tutorProfile.upsert({
      where: { userId: tutorUser.id },
      update: {},
      create: {
        id: crypto.randomUUID(),
        userId: tutorUser.id,
        bio: "Experienced Math tutor with 5 years of teaching.",
        hourlyRate: 25.0,
        subjects: {
          connect: [{ name: "Mathematics" }],
        },
      },
    });

    console.log(" Tutor profile seeded:", tutorUser.email);
  } catch (err: any) {
    console.error(
      " Error seeding tutor:",
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
