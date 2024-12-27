/*
  Warnings:

  - Added the required column `activationToken` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "activationToken" TEXT NOT NULL,
ADD COLUMN     "isActivate" BOOLEAN NOT NULL DEFAULT false;
