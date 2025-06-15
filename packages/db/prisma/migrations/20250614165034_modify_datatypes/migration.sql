/*
  Warnings:

  - Changed the type of `sellQty` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `buyQty` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "sellQty",
ADD COLUMN     "sellQty" INTEGER NOT NULL,
DROP COLUMN "buyQty",
ADD COLUMN     "buyQty" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION;
