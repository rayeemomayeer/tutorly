/*
  Warnings:

  - Made the column `slotId` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_slotId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "slotId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Availability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
