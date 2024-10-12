-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
CREATE TABLE IF NOT EXISTS "_PostToTag" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "citext" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Company" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" jsonb NOT NULL,
	"bussinessId" text,
	"website" text,
	"partner" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"logoUrl" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"title" jsonb NOT NULL,
	"body" jsonb NOT NULL,
	"opensAt" timestamp(3),
	"closesAt" timestamp(3),
	"recruitingCompanyId" integer,
	"employingCompanyId" integer NOT NULL,
	"displayRecruitingCompany" boolean DEFAULT false NOT NULL,
	"applicationLink" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_recruitingCompanyId_fkey" FOREIGN KEY ("recruitingCompanyId") REFERENCES "public"."Company"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_employingCompanyId_fkey" FOREIGN KEY ("employingCompanyId") REFERENCES "public"."Company"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_PostToTag_AB_unique" ON "_PostToTag" USING btree ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_PostToTag_B_index" ON "_PostToTag" USING btree ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_bussinessId_key" ON "Company" USING btree ("bussinessId");
