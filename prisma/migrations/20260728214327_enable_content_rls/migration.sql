-- This is an empty migration.
-- Keep the public Data API read/write-closed. Admin writes use the server-only
-- database connection after the Supabase Auth admin check.
ALTER TABLE "Blob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Image" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntryImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntry" ENABLE ROW LEVEL SECURITY;
