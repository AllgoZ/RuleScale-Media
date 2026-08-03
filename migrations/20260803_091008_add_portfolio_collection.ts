import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_portfolio_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_portfolio_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__portfolio_v_version_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__portfolio_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "portfolio_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "portfolio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"client" varchar,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"media_type" "enum_portfolio_media_type" DEFAULT 'image',
  	"category" varchar,
  	"description" varchar,
  	"result_headline" varchar,
  	"thumbnail_url" varchar,
  	"thumbnail_public_id" varchar,
  	"thumbnail_width" numeric,
  	"thumbnail_height" numeric,
  	"thumbnail_format" varchar,
  	"video_url" varchar,
  	"case_study_content" jsonb,
  	"live_website" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"published_at" timestamp(3) with time zone,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_meta_image" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_portfolio_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_portfolio_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_client" varchar,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_media_type" "enum__portfolio_v_version_media_type" DEFAULT 'image',
  	"version_category" varchar,
  	"version_description" varchar,
  	"version_result_headline" varchar,
  	"version_thumbnail_url" varchar,
  	"version_thumbnail_public_id" varchar,
  	"version_thumbnail_width" numeric,
  	"version_thumbnail_height" numeric,
  	"version_thumbnail_format" varchar,
  	"version_video_url" varchar,
  	"version_case_study_content" jsonb,
  	"version_live_website" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_meta_image" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__portfolio_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "homepage" ALTER COLUMN "hero_primary_cta_href" SET DEFAULT '/#final-cta';
  ALTER TABLE "homepage" ALTER COLUMN "hero_secondary_cta_href" SET DEFAULT '/#case-studies';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_hero_primary_cta_href" SET DEFAULT '/#final-cta';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_hero_secondary_cta_href" SET DEFAULT '/#case-studies';
  ALTER TABLE "navigation" ALTER COLUMN "cta_href" SET DEFAULT '/#final-cta';
  ALTER TABLE "site_settings" ALTER COLUMN "url" SET DEFAULT 'https://www.rulescale.in';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "portfolio_id" integer;
  ALTER TABLE "portfolio_services" ADD CONSTRAINT "portfolio_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_v_version_services" ADD CONSTRAINT "_portfolio_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_v" ADD CONSTRAINT "_portfolio_v_parent_id_portfolio_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "portfolio_services_order_idx" ON "portfolio_services" USING btree ("_order");
  CREATE INDEX "portfolio_services_parent_id_idx" ON "portfolio_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "portfolio_slug_idx" ON "portfolio" USING btree ("slug");
  CREATE INDEX "portfolio_updated_at_idx" ON "portfolio" USING btree ("updated_at");
  CREATE INDEX "portfolio_created_at_idx" ON "portfolio" USING btree ("created_at");
  CREATE INDEX "portfolio__status_idx" ON "portfolio" USING btree ("_status");
  CREATE INDEX "_portfolio_v_version_services_order_idx" ON "_portfolio_v_version_services" USING btree ("_order");
  CREATE INDEX "_portfolio_v_version_services_parent_id_idx" ON "_portfolio_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_v_parent_idx" ON "_portfolio_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_v_version_version_slug_idx" ON "_portfolio_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_v_version_version_updated_at_idx" ON "_portfolio_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_v_version_version_created_at_idx" ON "_portfolio_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_v_version_version__status_idx" ON "_portfolio_v" USING btree ("version__status");
  CREATE INDEX "_portfolio_v_created_at_idx" ON "_portfolio_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_v_updated_at_idx" ON "_portfolio_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_v_latest_idx" ON "_portfolio_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_portfolio_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_portfolio_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_portfolio_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "portfolio_services" CASCADE;
  DROP TABLE "portfolio" CASCADE;
  DROP TABLE "_portfolio_v_version_services" CASCADE;
  DROP TABLE "_portfolio_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_fk";
  
  DROP INDEX "payload_locked_documents_rels_portfolio_id_idx";
  ALTER TABLE "homepage" ALTER COLUMN "hero_primary_cta_href" SET DEFAULT '#final-cta';
  ALTER TABLE "homepage" ALTER COLUMN "hero_secondary_cta_href" SET DEFAULT '#case-studies';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_hero_primary_cta_href" SET DEFAULT '#final-cta';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_hero_secondary_cta_href" SET DEFAULT '#case-studies';
  ALTER TABLE "navigation" ALTER COLUMN "cta_href" SET DEFAULT '#final-cta';
  ALTER TABLE "site_settings" ALTER COLUMN "url" SET DEFAULT 'https://www.rulescalemedia.com';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "portfolio_id";
  DROP TYPE "public"."enum_portfolio_media_type";
  DROP TYPE "public"."enum_portfolio_status";
  DROP TYPE "public"."enum__portfolio_v_version_media_type";
  DROP TYPE "public"."enum__portfolio_v_version_status";`)
}
