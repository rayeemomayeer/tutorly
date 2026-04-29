-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('OPEN', 'BOOKED');

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "status" "AvailabilityStatus" NOT NULL DEFAULT 'OPEN';
