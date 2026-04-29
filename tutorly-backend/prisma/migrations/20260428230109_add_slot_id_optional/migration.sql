-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "slotId" TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Availability"("id") ON DELETE SET NULL ON UPDATE CASCADE;
