import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_influencer_apps_creator_face_type" AS ENUM('face-creator', 'faceless-creator');
  CREATE TYPE "public"."enum__influencer_apps_v_version_creator_face_type" AS ENUM('face-creator', 'faceless-creator');
  CREATE TABLE "influencer_apps_creator_face_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_influencer_apps_creator_face_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_influencer_apps_v_version_creator_face_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__influencer_apps_v_version_creator_face_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "influencer_apps" ADD COLUMN "instagram_followers" numeric;
  ALTER TABLE "influencer_apps" ADD COLUMN "second_instagram_followers" numeric;
  ALTER TABLE "influencer_apps" ADD COLUMN "youtube_followers" numeric;
  ALTER TABLE "influencer_apps" ADD COLUMN "snapchat_followers" numeric;
  ALTER TABLE "influencer_apps" ADD COLUMN "facebook_followers" numeric;
  ALTER TABLE "influencer_apps" ADD COLUMN "twitter_followers" numeric;
  ALTER TABLE "influencer_apps" ADD COLUMN "linkedin_followers" numeric;
  ALTER TABLE "_influencer_apps_v" ADD COLUMN "version_instagram_followers" numeric;
  ALTER TABLE "_influencer_apps_v" ADD COLUMN "version_second_instagram_followers" numeric;
  ALTER TABLE "_influencer_apps_v" ADD COLUMN "version_youtube_followers" numeric;
  ALTER TABLE "_influencer_apps_v" ADD COLUMN "version_snapchat_followers" numeric;
  ALTER TABLE "_influencer_apps_v" ADD COLUMN "version_facebook_followers" numeric;
  ALTER TABLE "_influencer_apps_v" ADD COLUMN "version_twitter_followers" numeric;
  ALTER TABLE "_influencer_apps_v" ADD COLUMN "version_linkedin_followers" numeric;
  ALTER TABLE "influencer_apps_creator_face_type" ADD CONSTRAINT "influencer_apps_creator_face_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."influencer_apps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influencer_apps_v_version_creator_face_type" ADD CONSTRAINT "_influencer_apps_v_version_creator_face_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_influencer_apps_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "influencer_apps_creator_face_type_order_idx" ON "influencer_apps_creator_face_type" USING btree ("order");
  CREATE INDEX "influencer_apps_creator_face_type_parent_idx" ON "influencer_apps_creator_face_type" USING btree ("parent_id");
  CREATE INDEX "_influencer_apps_v_version_creator_face_type_order_idx" ON "_influencer_apps_v_version_creator_face_type" USING btree ("order");
  CREATE INDEX "_influencer_apps_v_version_creator_face_type_parent_idx" ON "_influencer_apps_v_version_creator_face_type" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "influencer_apps_creator_face_type" CASCADE;
  DROP TABLE "_influencer_apps_v_version_creator_face_type" CASCADE;
  ALTER TABLE "influencer_apps" DROP COLUMN "instagram_followers";
  ALTER TABLE "influencer_apps" DROP COLUMN "second_instagram_followers";
  ALTER TABLE "influencer_apps" DROP COLUMN "youtube_followers";
  ALTER TABLE "influencer_apps" DROP COLUMN "snapchat_followers";
  ALTER TABLE "influencer_apps" DROP COLUMN "facebook_followers";
  ALTER TABLE "influencer_apps" DROP COLUMN "twitter_followers";
  ALTER TABLE "influencer_apps" DROP COLUMN "linkedin_followers";
  ALTER TABLE "_influencer_apps_v" DROP COLUMN "version_instagram_followers";
  ALTER TABLE "_influencer_apps_v" DROP COLUMN "version_second_instagram_followers";
  ALTER TABLE "_influencer_apps_v" DROP COLUMN "version_youtube_followers";
  ALTER TABLE "_influencer_apps_v" DROP COLUMN "version_snapchat_followers";
  ALTER TABLE "_influencer_apps_v" DROP COLUMN "version_facebook_followers";
  ALTER TABLE "_influencer_apps_v" DROP COLUMN "version_twitter_followers";
  ALTER TABLE "_influencer_apps_v" DROP COLUMN "version_linkedin_followers";
  DROP TYPE "public"."enum_influencer_apps_creator_face_type";
  DROP TYPE "public"."enum__influencer_apps_v_version_creator_face_type";`)
}
