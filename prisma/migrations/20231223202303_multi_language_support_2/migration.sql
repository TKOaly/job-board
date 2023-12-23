/*
  Warnings:

  - Changed the type of `title` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `body` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Post"
  ALTER "title" TYPE JSONB USING jsonb_build_object('xx', title),
  ALTER "body" TYPE JSONB USING jsonb_build_object('xx', body);
