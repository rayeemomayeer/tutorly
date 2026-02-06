import { prisma } from "../config/db";

async function main() {
  console.log("Seeding database...");

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@skillbridge.com" },
    update: {},
    create: {
      email: "admin@skillbridge.com",
      name: "Super Admin",
      role: "ADMIN",
    },
  });

  // Categories
  await prisma.category.createMany({
    data: [
      { name: "Mathematics" },
      { name: "Physics" },
      { name: "Programming" },
    ],
    skipDuplicates: true,
  });

  // Tutor
  const tutorUser = await prisma.user.upsert({
    where: { email: "tutor@skillbridge.com" },
    update: {},
    create: {
      email: "tutor@skillbridge.com",
      name: "Alex Tutor",
      role: "TUTOR",
    },
  });

  const tutorProfile = await prisma.tutorProfile.upsert({
    where: { userId: tutorUser.id },
    update: {},
    create: {
      userId: tutorUser.id,
      bio: "Experienced Math tutor",
      hourlyRate: 25,
      rating: 4.8,
    },
  });

  const mathCategory = await prisma.category.findUnique({
    where: { name: "Mathematics" },
  });

  if (mathCategory) {
    await prisma.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: {
        subjects: { connect: { id: mathCategory.id } },
      },
    });
  }

  // Student
  const studentUser = await prisma.user.upsert({
    where: { email: "student@skillbridge.com" },
    update: {},
    create: {
      email: "student@skillbridge.com",
      name: "Emily Student",
      role: "STUDENT",
    },
  });

  // Booking
  const booking = await prisma.booking.create({
    data: {
      studentId: studentUser.id,
      tutorId: tutorProfile.id,
      status: "CONFIRMED",
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Review
  await prisma.review.create({
    data: {
      studentId: studentUser.id,
      tutorId: tutorProfile.id,
      rating: 5,
      comment: "Great tutor!",
      bookingId: booking.id,
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });