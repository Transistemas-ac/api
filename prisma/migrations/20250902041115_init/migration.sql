/*
  Warnings:

  - You are about to drop the column `inscription_url` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `UsersCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersCourses" DROP CONSTRAINT "UsersCourses_course_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersCourses" DROP CONSTRAINT "UsersCourses_user_id_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "inscription_url",
ADD COLUMN     "subscription_url" TEXT;

-- DropTable
DROP TABLE "UsersCourses";

-- CreateTable
CREATE TABLE "Subscription" (
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "role" "CourseRole" NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("user_id","course_id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
