-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_tutorId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
