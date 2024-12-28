/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_date_key" ON "Event"("date");
