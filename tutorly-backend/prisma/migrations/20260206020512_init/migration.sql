/*
  Warnings:

  - You are about to drop the `AvailabilitySlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TutorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TutorCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvailabilitySlot" DROP CONSTRAINT "AvailabilitySlot_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "TutorProfile" DROP CONSTRAINT "TutorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "_TutorCategories" DROP CONSTRAINT "_TutorCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_TutorCategories" DROP CONSTRAINT "_TutorCategories_B_fkey";

-- DropTable
DROP TABLE "AvailabilitySlot";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "TutorProfile";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_TutorCategories";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "Role";
