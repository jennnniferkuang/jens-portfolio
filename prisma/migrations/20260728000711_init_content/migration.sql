-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('GALLERY', 'JOURNAL', 'PROJECTS', 'VISITOR_GALLERY');

-- CreateTable
CREATE TABLE "Blob" (
    "id" UUID NOT NULL,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" UUID NOT NULL,
    "blobId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "origin" "Origin" NOT NULL,
    "alt_text" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntryImage" (
    "id" UUID NOT NULL,
    "image_id" UUID NOT NULL,
    "journal_entry_id" UUID NOT NULL,
    "entry_key" TEXT NOT NULL,

    CONSTRAINT "JournalEntryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blob_path_key" ON "Blob"("path");

-- CreateIndex
CREATE INDEX "Blob_id_idx" ON "Blob"("id");

-- CreateIndex
CREATE INDEX "Image_id_idx" ON "Image"("id");

-- CreateIndex
CREATE INDEX "JournalEntryImage_id_idx" ON "JournalEntryImage"("id");

-- CreateIndex
CREATE INDEX "JournalEntry_id_idx" ON "JournalEntry"("id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "Blob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryImage" ADD CONSTRAINT "JournalEntryImage_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryImage" ADD CONSTRAINT "JournalEntryImage_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "JournalEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
