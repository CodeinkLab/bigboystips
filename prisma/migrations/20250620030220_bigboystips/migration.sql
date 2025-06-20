/*
  Warnings:

  - The `odds` column on the `Prediction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "League" ADD COLUMN     "sporttype" TEXT NOT NULL DEFAULT 'Football';

-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "sportType" TEXT NOT NULL DEFAULT 'Football',
DROP COLUMN "odds",
ADD COLUMN     "odds" DOUBLE PRECISION;
