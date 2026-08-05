import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_influencer_apps_interested_campaigns" AS ENUM('paid-campaigns', 'affiliate', 'ugc', 'long-term-partnerships', 'product-reviews', 'brand-ambassador', 'events', 'creator-workshops');
  CREATE TYPE "public"."enum_influencer_apps_gender" AS ENUM('female', 'male', 'non-binary', 'prefer-not-to-say');
  CREATE TYPE "public"."enum_influencer_apps_primary_category" AS ENUM('fashion-style', 'beauty-skincare', 'fitness-health', 'food-cooking', 'travel', 'tech-gadgets', 'gaming', 'lifestyle-vlogging', 'comedy-entertainment', 'education', 'finance', 'parenting-family', 'other');
  CREATE TYPE "public"."enum_influencer_apps_creator_type" AS ENUM('content-creator', 'influencer', 'ugc-creator', 'photographer', 'videographer', 'model', 'other');
  CREATE TYPE "public"."enum_influencer_apps_participate_ecommerce" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_influencer_apps_accepting_collaborations" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_influencer_apps_available_for_travel" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_influencer_apps_heard_about_us" AS ENUM('instagram', 'google-search', 'creator-referral', 'brand-referral', 'linkedin', 'event-workshop', 'other');
  CREATE TYPE "public"."enum_influencer_apps_status" AS ENUM('applied', 'reviewing', 'shortlisted', 'approved', 'rejected', 'onboarded');
  CREATE TYPE "public"."enum_influencer_apps_verification_status" AS ENUM('unverified', 'verified', 'flagged');
  CREATE TYPE "public"."enum_influencer_apps_tier" AS ENUM('nano', 'micro', 'mid-tier', 'macro', 'mega');
  CREATE TYPE "public"."enum_influencer_apps_payment_status" AS ENUM('not-applicable', 'pending', 'paid', 'overdue');
  CREATE TYPE "public"."enum__influencer_apps_v_version_interested_campaigns" AS ENUM('paid-campaigns', 'affiliate', 'ugc', 'long-term-partnerships', 'product-reviews', 'brand-ambassador', 'events', 'creator-workshops');
  CREATE TYPE "public"."enum__influencer_apps_v_version_gender" AS ENUM('female', 'male', 'non-binary', 'prefer-not-to-say');
  CREATE TYPE "public"."enum__influencer_apps_v_version_primary_category" AS ENUM('fashion-style', 'beauty-skincare', 'fitness-health', 'food-cooking', 'travel', 'tech-gadgets', 'gaming', 'lifestyle-vlogging', 'comedy-entertainment', 'education', 'finance', 'parenting-family', 'other');
  CREATE TYPE "public"."enum__influencer_apps_v_version_creator_type" AS ENUM('content-creator', 'influencer', 'ugc-creator', 'photographer', 'videographer', 'model', 'other');
  CREATE TYPE "public"."enum__influencer_apps_v_version_participate_ecommerce" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__influencer_apps_v_version_accepting_collaborations" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__influencer_apps_v_version_available_for_travel" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__influencer_apps_v_version_heard_about_us" AS ENUM('instagram', 'google-search', 'creator-referral', 'brand-referral', 'linkedin', 'event-workshop', 'other');
  CREATE TYPE "public"."enum__influencer_apps_v_version_status" AS ENUM('applied', 'reviewing', 'shortlisted', 'approved', 'rejected', 'onboarded');
  CREATE TYPE "public"."enum__influencer_apps_v_version_verification_status" AS ENUM('unverified', 'verified', 'flagged');
  CREATE TYPE "public"."enum__influencer_apps_v_version_tier" AS ENUM('nano', 'micro', 'mid-tier', 'macro', 'mega');
  CREATE TYPE "public"."enum__influencer_apps_v_version_payment_status" AS ENUM('not-applicable', 'pending', 'paid', 'overdue');
  CREATE TABLE "influencer_apps_interested_campaigns" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_influencer_apps_interested_campaigns",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "influencer_apps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"contact_number" varchar NOT NULL,
  	"alternative_contact" varchar,
  	"email" varchar NOT NULL,
  	"gender" "enum_influencer_apps_gender",
  	"age" numeric,
  	"primary_category" "enum_influencer_apps_primary_category" NOT NULL,
  	"subcategory" varchar,
  	"creator_type" "enum_influencer_apps_creator_type" NOT NULL,
  	"bio" varchar,
  	"years_as_creator" numeric,
  	"current_occupation" varchar,
  	"country" varchar DEFAULT 'India',
  	"state" varchar,
  	"city" varchar,
  	"district" varchar,
  	"area" varchar,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"house_number" varchar,
  	"landmark" varchar,
  	"pincode" varchar,
  	"instagram" varchar NOT NULL,
  	"second_instagram" varchar,
  	"youtube" varchar,
  	"snapchat" varchar,
  	"facebook" varchar,
  	"twitter" varchar,
  	"linkedin" varchar,
  	"other_platforms" varchar,
  	"portfolio_link" varchar,
  	"media_kit_url" varchar,
  	"media_kit_public_id" varchar,
  	"rate_card_url" varchar,
  	"rate_card_public_id" varchar,
  	"audience_country" varchar,
  	"audience_age" varchar,
  	"audience_gender" varchar,
  	"monthly_reach" numeric,
  	"monthly_impressions" numeric,
  	"average_story_views" numeric,
  	"average_reel_views" numeric,
  	"average_last5_video_views" numeric NOT NULL,
  	"engagement_rate" numeric,
  	"participate_ecommerce" "enum_influencer_apps_participate_ecommerce",
  	"commercial_reel" numeric NOT NULL,
  	"commercial_story" numeric NOT NULL,
  	"monthly_campaign_capacity" numeric,
  	"accepting_collaborations" "enum_influencer_apps_accepting_collaborations",
  	"available_for_travel" "enum_influencer_apps_available_for_travel",
  	"previous_brand_collaborations" varchar NOT NULL,
  	"content_language" varchar NOT NULL,
  	"content_platforms" varchar,
  	"heard_about_us" "enum_influencer_apps_heard_about_us",
  	"additional_info" varchar,
  	"terms_accepted" boolean DEFAULT false NOT NULL,
  	"privacy_accepted" boolean DEFAULT false NOT NULL,
  	"status" "enum_influencer_apps_status" DEFAULT 'applied',
  	"internal_notes" varchar,
  	"assigned_manager_id" integer,
  	"verification_status" "enum_influencer_apps_verification_status" DEFAULT 'unverified',
  	"creator_score" numeric,
  	"tier" "enum_influencer_apps_tier",
  	"last_contact_date" timestamp(3) with time zone,
  	"next_followup" timestamp(3) with time zone,
  	"payment_status" "enum_influencer_apps_payment_status" DEFAULT 'not-applicable',
  	"contract_signed" boolean DEFAULT false,
  	"attribution_ip_address" varchar,
  	"attribution_user_agent" varchar,
  	"attribution_referrer" varchar,
  	"attribution_landing_page" varchar,
  	"attribution_device" varchar,
  	"attribution_browser" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "influencer_apps_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_influencer_apps_v_version_interested_campaigns" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__influencer_apps_v_version_interested_campaigns",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_influencer_apps_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_full_name" varchar NOT NULL,
  	"version_contact_number" varchar NOT NULL,
  	"version_alternative_contact" varchar,
  	"version_email" varchar NOT NULL,
  	"version_gender" "enum__influencer_apps_v_version_gender",
  	"version_age" numeric,
  	"version_primary_category" "enum__influencer_apps_v_version_primary_category" NOT NULL,
  	"version_subcategory" varchar,
  	"version_creator_type" "enum__influencer_apps_v_version_creator_type" NOT NULL,
  	"version_bio" varchar,
  	"version_years_as_creator" numeric,
  	"version_current_occupation" varchar,
  	"version_country" varchar DEFAULT 'India',
  	"version_state" varchar,
  	"version_city" varchar,
  	"version_district" varchar,
  	"version_area" varchar,
  	"version_address_line1" varchar,
  	"version_address_line2" varchar,
  	"version_house_number" varchar,
  	"version_landmark" varchar,
  	"version_pincode" varchar,
  	"version_instagram" varchar NOT NULL,
  	"version_second_instagram" varchar,
  	"version_youtube" varchar,
  	"version_snapchat" varchar,
  	"version_facebook" varchar,
  	"version_twitter" varchar,
  	"version_linkedin" varchar,
  	"version_other_platforms" varchar,
  	"version_portfolio_link" varchar,
  	"version_media_kit_url" varchar,
  	"version_media_kit_public_id" varchar,
  	"version_rate_card_url" varchar,
  	"version_rate_card_public_id" varchar,
  	"version_audience_country" varchar,
  	"version_audience_age" varchar,
  	"version_audience_gender" varchar,
  	"version_monthly_reach" numeric,
  	"version_monthly_impressions" numeric,
  	"version_average_story_views" numeric,
  	"version_average_reel_views" numeric,
  	"version_average_last5_video_views" numeric NOT NULL,
  	"version_engagement_rate" numeric,
  	"version_participate_ecommerce" "enum__influencer_apps_v_version_participate_ecommerce",
  	"version_commercial_reel" numeric NOT NULL,
  	"version_commercial_story" numeric NOT NULL,
  	"version_monthly_campaign_capacity" numeric,
  	"version_accepting_collaborations" "enum__influencer_apps_v_version_accepting_collaborations",
  	"version_available_for_travel" "enum__influencer_apps_v_version_available_for_travel",
  	"version_previous_brand_collaborations" varchar NOT NULL,
  	"version_content_language" varchar NOT NULL,
  	"version_content_platforms" varchar,
  	"version_heard_about_us" "enum__influencer_apps_v_version_heard_about_us",
  	"version_additional_info" varchar,
  	"version_terms_accepted" boolean DEFAULT false NOT NULL,
  	"version_privacy_accepted" boolean DEFAULT false NOT NULL,
  	"version_status" "enum__influencer_apps_v_version_status" DEFAULT 'applied',
  	"version_internal_notes" varchar,
  	"version_assigned_manager_id" integer,
  	"version_verification_status" "enum__influencer_apps_v_version_verification_status" DEFAULT 'unverified',
  	"version_creator_score" numeric,
  	"version_tier" "enum__influencer_apps_v_version_tier",
  	"version_last_contact_date" timestamp(3) with time zone,
  	"version_next_followup" timestamp(3) with time zone,
  	"version_payment_status" "enum__influencer_apps_v_version_payment_status" DEFAULT 'not-applicable',
  	"version_contract_signed" boolean DEFAULT false,
  	"version_attribution_ip_address" varchar,
  	"version_attribution_user_agent" varchar,
  	"version_attribution_referrer" varchar,
  	"version_attribution_landing_page" varchar,
  	"version_attribution_device" varchar,
  	"version_attribution_browser" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_influencer_apps_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "influencer_apps_id" integer;
  ALTER TABLE "influencer_apps_interested_campaigns" ADD CONSTRAINT "influencer_apps_interested_campaigns_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."influencer_apps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influencer_apps" ADD CONSTRAINT "influencer_apps_assigned_manager_id_users_id_fk" FOREIGN KEY ("assigned_manager_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "influencer_apps_texts" ADD CONSTRAINT "influencer_apps_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."influencer_apps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influencer_apps_v_version_interested_campaigns" ADD CONSTRAINT "_influencer_apps_v_version_interested_campaigns_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_influencer_apps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influencer_apps_v" ADD CONSTRAINT "_influencer_apps_v_parent_id_influencer_apps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."influencer_apps"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_influencer_apps_v" ADD CONSTRAINT "_influencer_apps_v_version_assigned_manager_id_users_id_fk" FOREIGN KEY ("version_assigned_manager_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_influencer_apps_v_texts" ADD CONSTRAINT "_influencer_apps_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_influencer_apps_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "influencer_apps_interested_campaigns_order_idx" ON "influencer_apps_interested_campaigns" USING btree ("order");
  CREATE INDEX "influencer_apps_interested_campaigns_parent_idx" ON "influencer_apps_interested_campaigns" USING btree ("parent_id");
  CREATE INDEX "influencer_apps_assigned_manager_idx" ON "influencer_apps" USING btree ("assigned_manager_id");
  CREATE INDEX "influencer_apps_updated_at_idx" ON "influencer_apps" USING btree ("updated_at");
  CREATE INDEX "influencer_apps_created_at_idx" ON "influencer_apps" USING btree ("created_at");
  CREATE INDEX "influencer_apps_texts_order_parent" ON "influencer_apps_texts" USING btree ("order","parent_id");
  CREATE INDEX "_influencer_apps_v_version_interested_campaigns_order_idx" ON "_influencer_apps_v_version_interested_campaigns" USING btree ("order");
  CREATE INDEX "_influencer_apps_v_version_interested_campaigns_parent_idx" ON "_influencer_apps_v_version_interested_campaigns" USING btree ("parent_id");
  CREATE INDEX "_influencer_apps_v_parent_idx" ON "_influencer_apps_v" USING btree ("parent_id");
  CREATE INDEX "_influencer_apps_v_version_version_assigned_manager_idx" ON "_influencer_apps_v" USING btree ("version_assigned_manager_id");
  CREATE INDEX "_influencer_apps_v_version_version_updated_at_idx" ON "_influencer_apps_v" USING btree ("version_updated_at");
  CREATE INDEX "_influencer_apps_v_version_version_created_at_idx" ON "_influencer_apps_v" USING btree ("version_created_at");
  CREATE INDEX "_influencer_apps_v_created_at_idx" ON "_influencer_apps_v" USING btree ("created_at");
  CREATE INDEX "_influencer_apps_v_updated_at_idx" ON "_influencer_apps_v" USING btree ("updated_at");
  CREATE INDEX "_influencer_apps_v_texts_order_parent" ON "_influencer_apps_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_influencer_applications_fk" FOREIGN KEY ("influencer_apps_id") REFERENCES "public"."influencer_apps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_influencer_apps_id_idx" ON "payload_locked_documents_rels" USING btree ("influencer_apps_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "influencer_apps_interested_campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "influencer_apps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "influencer_apps_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_influencer_apps_v_version_interested_campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_influencer_apps_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_influencer_apps_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "influencer_apps_interested_campaigns" CASCADE;
  DROP TABLE "influencer_apps" CASCADE;
  DROP TABLE "influencer_apps_texts" CASCADE;
  DROP TABLE "_influencer_apps_v_version_interested_campaigns" CASCADE;
  DROP TABLE "_influencer_apps_v" CASCADE;
  DROP TABLE "_influencer_apps_v_texts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_influencer_applications_fk";
  
  DROP INDEX "payload_locked_documents_rels_influencer_apps_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "influencer_apps_id";
  DROP TYPE "public"."enum_influencer_apps_interested_campaigns";
  DROP TYPE "public"."enum_influencer_apps_gender";
  DROP TYPE "public"."enum_influencer_apps_primary_category";
  DROP TYPE "public"."enum_influencer_apps_creator_type";
  DROP TYPE "public"."enum_influencer_apps_participate_ecommerce";
  DROP TYPE "public"."enum_influencer_apps_accepting_collaborations";
  DROP TYPE "public"."enum_influencer_apps_available_for_travel";
  DROP TYPE "public"."enum_influencer_apps_heard_about_us";
  DROP TYPE "public"."enum_influencer_apps_status";
  DROP TYPE "public"."enum_influencer_apps_verification_status";
  DROP TYPE "public"."enum_influencer_apps_tier";
  DROP TYPE "public"."enum_influencer_apps_payment_status";
  DROP TYPE "public"."enum__influencer_apps_v_version_interested_campaigns";
  DROP TYPE "public"."enum__influencer_apps_v_version_gender";
  DROP TYPE "public"."enum__influencer_apps_v_version_primary_category";
  DROP TYPE "public"."enum__influencer_apps_v_version_creator_type";
  DROP TYPE "public"."enum__influencer_apps_v_version_participate_ecommerce";
  DROP TYPE "public"."enum__influencer_apps_v_version_accepting_collaborations";
  DROP TYPE "public"."enum__influencer_apps_v_version_available_for_travel";
  DROP TYPE "public"."enum__influencer_apps_v_version_heard_about_us";
  DROP TYPE "public"."enum__influencer_apps_v_version_status";
  DROP TYPE "public"."enum__influencer_apps_v_version_verification_status";
  DROP TYPE "public"."enum__influencer_apps_v_version_tier";
  DROP TYPE "public"."enum__influencer_apps_v_version_payment_status";`)
}
