-- Follow-up email state on Booking.
--
-- Written by hand rather than by `prisma migrate dev`, which wanted to reset
-- the database: the migration history has drifted from the schema (indexes
-- added elsewhere), and a reset to add three nullable columns would have
-- destroyed the local booking data to fix a bookkeeping problem.
--
-- Purely additive, so it is safe to run against a database with rows in it.
ALTER TABLE "Booking" ADD COLUMN "reminderSentAt" DATETIME;
ALTER TABLE "Booking" ADD COLUMN "crossSellSentAt" DATETIME;
ALTER TABLE "Booking" ADD COLUMN "emailOptOut" BOOLEAN NOT NULL DEFAULT false;
