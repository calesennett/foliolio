/*
  Warnings:

  - Added the required column `thumbnail` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "thumbnail" TEXT NOT NULL;
