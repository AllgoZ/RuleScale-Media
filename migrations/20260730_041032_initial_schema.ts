import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leads_services_interested" AS ENUM('website-design', 'seo', 'performance-marketing', 'social-media', 'influencers', 'video', 'content', 'brand-strategy', 'media-buying', 'analytics', 'localization', 'consulting');
  CREATE TYPE "public"."enum_leads_budget" AS ENUM('under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-sure');
  CREATE TYPE "public"."enum_leads_source" AS ENUM('website-contact-form', 'newsletter', 'referral', 'other');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'won', 'lost');
  CREATE TYPE "public"."enum_leads_priority" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum__leads_v_version_services_interested" AS ENUM('website-design', 'seo', 'performance-marketing', 'social-media', 'influencers', 'video', 'content', 'brand-strategy', 'media-buying', 'analytics', 'localization', 'consulting');
  CREATE TYPE "public"."enum__leads_v_version_budget" AS ENUM('under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-sure');
  CREATE TYPE "public"."enum__leads_v_version_source" AS ENUM('website-contact-form', 'newsletter', 'referral', 'other');
  CREATE TYPE "public"."enum__leads_v_version_status" AS ENUM('new', 'contacted', 'qualified', 'won', 'lost');
  CREATE TYPE "public"."enum__leads_v_version_priority" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_homepage_services_items_icon" AS ENUM('layout', 'search', 'target', 'share-2', 'sparkles', 'video', 'pen-line', 'compass', 'megaphone', 'bar-chart-3', 'globe', 'lightbulb');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_services_items_icon" AS ENUM('layout', 'search', 'target', 'share-2', 'sparkles', 'video', 'pen-line', 'compass', 'megaphone', 'bar-chart-3', 'globe', 'lightbulb');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('instagram', 'linkedin', 'youtube');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar,
  	"avatar_id" integer,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"featured_image_id" integer,
  	"category_id" integer,
  	"author_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_og_image_id" integer,
  	"seo_twitter_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_featured_image_id" integer,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_twitter_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar NOT NULL,
  	"industry" varchar NOT NULL,
  	"result" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads_services_interested" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_leads_services_interested",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"website" varchar,
  	"budget" "enum_leads_budget",
  	"message" varchar,
  	"source" "enum_leads_source" DEFAULT 'website-contact-form',
  	"status" "enum_leads_status" DEFAULT 'new',
  	"priority" "enum_leads_priority" DEFAULT 'medium',
  	"assigned_user_id" integer,
  	"internal_notes" varchar,
  	"attribution_ip_address" varchar,
  	"attribution_user_agent" varchar,
  	"attribution_referrer" varchar,
  	"attribution_landing_page" varchar,
  	"attribution_utm_source" varchar,
  	"attribution_utm_medium" varchar,
  	"attribution_utm_campaign" varchar,
  	"attribution_utm_term" varchar,
  	"attribution_utm_content" varchar,
  	"attribution_device" varchar,
  	"attribution_browser" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_leads_v_version_services_interested" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__leads_v_version_services_interested",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_leads_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_email" varchar NOT NULL,
  	"version_phone" varchar,
  	"version_company" varchar,
  	"version_website" varchar,
  	"version_budget" "enum__leads_v_version_budget",
  	"version_message" varchar,
  	"version_source" "enum__leads_v_version_source" DEFAULT 'website-contact-form',
  	"version_status" "enum__leads_v_version_status" DEFAULT 'new',
  	"version_priority" "enum__leads_v_version_priority" DEFAULT 'medium',
  	"version_assigned_user_id" integer,
  	"version_internal_notes" varchar,
  	"version_attribution_ip_address" varchar,
  	"version_attribution_user_agent" varchar,
  	"version_attribution_referrer" varchar,
  	"version_attribution_landing_page" varchar,
  	"version_attribution_utm_source" varchar,
  	"version_attribution_utm_medium" varchar,
  	"version_attribution_utm_campaign" varchar,
  	"version_attribution_utm_term" varchar,
  	"version_attribution_utm_content" varchar,
  	"version_attribution_device" varchar,
  	"version_attribution_browser" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"lead_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contracts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "meetings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client_id" integer,
  	"date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"authors_id" integer,
  	"posts_id" integer,
  	"tags_id" integer,
  	"testimonials_id" integer,
  	"case_studies_id" integer,
  	"leads_id" integer,
  	"clients_id" integer,
  	"projects_id" integer,
  	"contracts_id" integer,
  	"files_id" integer,
  	"meetings_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_trust_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "homepage_problem_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"note" varchar,
  	"rotate" numeric DEFAULT 0
  );
  
  CREATE TABLE "homepage_manifesto_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar
  );
  
  CREATE TABLE "homepage_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "homepage_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"note" varchar,
  	"description" varchar,
  	"icon" "enum_homepage_services_items_icon"
  );
  
  CREATE TABLE "homepage_results_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "homepage_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Hi, we''re RuleScale Media',
  	"hero_heading_prefix" varchar DEFAULT 'We grow brands',
  	"hero_heading_highlight" varchar DEFAULT 'people remember.',
  	"hero_subheading" varchar DEFAULT 'Marketing that actually moves businesses. We pair sharp strategy with website design, SEO, social, influencer, and video production — so growth isn''t left to chance.',
  	"hero_primary_cta_label" varchar DEFAULT 'Start Growing',
  	"hero_primary_cta_href" varchar DEFAULT '#final-cta',
  	"hero_secondary_cta_label" varchar DEFAULT 'See Our Work',
  	"hero_secondary_cta_href" varchar DEFAULT '#case-studies',
  	"hero_trust_line" varchar DEFAULT 'Trusted by 250+ brands across DTC, hospitality, SaaS, and retail.',
  	"trust_logos_label" varchar DEFAULT 'Our clients have been featured on',
  	"problem_eyebrow" varchar DEFAULT 'The problem',
  	"problem_heading" varchar DEFAULT 'Sound familiar?',
  	"manifesto_eyebrow" varchar DEFAULT 'About',
  	"manifesto_note" varchar DEFAULT 'That''s the only metric that compounds.',
  	"process_eyebrow" varchar DEFAULT 'Process',
  	"process_heading" varchar DEFAULT 'A plan, not a guess.',
  	"process_description" varchar DEFAULT 'Five steps, every time — so you always know what happens next and why.',
  	"services_eyebrow" varchar DEFAULT 'Services',
  	"services_heading" varchar DEFAULT 'One team. Every channel.',
  	"services_description" varchar DEFAULT 'Pick a single service, or hand us the whole growth engine. Tap any line to see what it actually includes.',
  	"results_eyebrow" varchar DEFAULT 'Proof',
  	"results_heading" varchar DEFAULT 'Growth you can measure.',
  	"results_note" varchar DEFAULT 'Every engagement is measured against outcomes we agree on before we start — no vanity metrics.',
  	"case_studies_eyebrow" varchar DEFAULT 'Case Studies',
  	"case_studies_heading" varchar DEFAULT 'Recent work we''re proud of.',
  	"testimonials_eyebrow" varchar DEFAULT 'Testimonials',
  	"faq_eyebrow" varchar DEFAULT 'FAQ',
  	"faq_heading" varchar DEFAULT 'Everything you''re wondering.',
  	"final_cta_eyebrow" varchar DEFAULT 'Get in touch',
  	"final_cta_heading" varchar DEFAULT 'Ready to become the brand everyone remembers?',
  	"final_cta_subheading" varchar DEFAULT 'Tell us where you''re stuck. We''ll tell you exactly how we''d fix it — no obligation, no jargon.',
  	"final_cta_cta_label" varchar DEFAULT 'Start Growing',
  	"final_cta_cta_href" varchar DEFAULT '/contact',
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_homepage_v_version_trust_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_problem_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"note" varchar,
  	"rotate" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_manifesto_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"note" varchar,
  	"description" varchar,
  	"icon" "enum__homepage_v_version_services_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_results_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Hi, we''re RuleScale Media',
  	"version_hero_heading_prefix" varchar DEFAULT 'We grow brands',
  	"version_hero_heading_highlight" varchar DEFAULT 'people remember.',
  	"version_hero_subheading" varchar DEFAULT 'Marketing that actually moves businesses. We pair sharp strategy with website design, SEO, social, influencer, and video production — so growth isn''t left to chance.',
  	"version_hero_primary_cta_label" varchar DEFAULT 'Start Growing',
  	"version_hero_primary_cta_href" varchar DEFAULT '#final-cta',
  	"version_hero_secondary_cta_label" varchar DEFAULT 'See Our Work',
  	"version_hero_secondary_cta_href" varchar DEFAULT '#case-studies',
  	"version_hero_trust_line" varchar DEFAULT 'Trusted by 250+ brands across DTC, hospitality, SaaS, and retail.',
  	"version_trust_logos_label" varchar DEFAULT 'Our clients have been featured on',
  	"version_problem_eyebrow" varchar DEFAULT 'The problem',
  	"version_problem_heading" varchar DEFAULT 'Sound familiar?',
  	"version_manifesto_eyebrow" varchar DEFAULT 'About',
  	"version_manifesto_note" varchar DEFAULT 'That''s the only metric that compounds.',
  	"version_process_eyebrow" varchar DEFAULT 'Process',
  	"version_process_heading" varchar DEFAULT 'A plan, not a guess.',
  	"version_process_description" varchar DEFAULT 'Five steps, every time — so you always know what happens next and why.',
  	"version_services_eyebrow" varchar DEFAULT 'Services',
  	"version_services_heading" varchar DEFAULT 'One team. Every channel.',
  	"version_services_description" varchar DEFAULT 'Pick a single service, or hand us the whole growth engine. Tap any line to see what it actually includes.',
  	"version_results_eyebrow" varchar DEFAULT 'Proof',
  	"version_results_heading" varchar DEFAULT 'Growth you can measure.',
  	"version_results_note" varchar DEFAULT 'Every engagement is measured against outcomes we agree on before we start — no vanity metrics.',
  	"version_case_studies_eyebrow" varchar DEFAULT 'Case Studies',
  	"version_case_studies_heading" varchar DEFAULT 'Recent work we''re proud of.',
  	"version_testimonials_eyebrow" varchar DEFAULT 'Testimonials',
  	"version_faq_eyebrow" varchar DEFAULT 'FAQ',
  	"version_faq_heading" varchar DEFAULT 'Everything you''re wondering.',
  	"version_final_cta_eyebrow" varchar DEFAULT 'Get in touch',
  	"version_final_cta_heading" varchar DEFAULT 'Ready to become the brand everyone remembers?',
  	"version_final_cta_subheading" varchar DEFAULT 'Tell us where you''re stuck. We''ll tell you exactly how we''d fix it — no obligation, no jargon.',
  	"version_final_cta_cta_label" varchar DEFAULT 'Start Growing',
  	"version_final_cta_cta_href" varchar DEFAULT '/contact',
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar DEFAULT 'Start Growing',
  	"cta_href" varchar DEFAULT '#final-cta',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"blurb" varchar DEFAULT 'A full-service marketing agency for brands who want to be remembered, not just seen.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'RuleScale Media',
  	"tagline" varchar DEFAULT 'We grow brands people remember.',
  	"description" varchar DEFAULT 'RuleScale Media is a full-service marketing agency for website design & development, SEO, social, influencer, video, and performance advertising — built to turn attention into revenue.',
  	"url" varchar DEFAULT 'https://www.rulescalemedia.com',
  	"contact_email" varchar DEFAULT 'hello@rulescale.media',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_settings_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "seo_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_title" varchar DEFAULT 'RuleScale Media | We grow brands people remember.',
  	"default_description" varchar DEFAULT 'RuleScale Media is a full-service marketing agency for website design & development, SEO, social, influencer, video, and performance advertising — built to turn attention into revenue.',
  	"og_image_alt" varchar DEFAULT 'RuleScale Media',
  	"twitter_handle" varchar,
  	"robots_index" boolean DEFAULT true,
  	"robots_follow" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_twitter_image_id_media_id_fk" FOREIGN KEY ("seo_twitter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_twitter_image_id_media_id_fk" FOREIGN KEY ("version_seo_twitter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_tags" ADD CONSTRAINT "case_studies_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_services_interested" ADD CONSTRAINT "leads_services_interested_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v_version_services_interested" ADD CONSTRAINT "_leads_v_version_services_interested_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_leads_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_parent_id_leads_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_assigned_user_id_users_id_fk" FOREIGN KEY ("version_assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "files" ADD CONSTRAINT "files_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meetings" ADD CONSTRAINT "meetings_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contracts_fk" FOREIGN KEY ("contracts_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_meetings_fk" FOREIGN KEY ("meetings_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_trust_logos_logos" ADD CONSTRAINT "homepage_trust_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_problem_cards" ADD CONSTRAINT "homepage_problem_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_manifesto_lines" ADD CONSTRAINT "homepage_manifesto_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_process_steps" ADD CONSTRAINT "homepage_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_services_items" ADD CONSTRAINT "homepage_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_results_stats" ADD CONSTRAINT "homepage_results_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_faq_items" ADD CONSTRAINT "homepage_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_trust_logos_logos" ADD CONSTRAINT "_homepage_v_version_trust_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_problem_cards" ADD CONSTRAINT "_homepage_v_version_problem_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_manifesto_lines" ADD CONSTRAINT "_homepage_v_version_manifesto_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_process_steps" ADD CONSTRAINT "_homepage_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_services_items" ADD CONSTRAINT "_homepage_v_version_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_results_stats" ADD CONSTRAINT "_homepage_v_version_results_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_faq_items" ADD CONSTRAINT "_homepage_v_version_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_service_links" ADD CONSTRAINT "footer_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_same_as" ADD CONSTRAINT "site_settings_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_settings_keywords" ADD CONSTRAINT "seo_settings_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_avatar_idx" ON "authors" USING btree ("avatar_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "posts_seo_seo_twitter_image_idx" ON "posts" USING btree ("seo_twitter_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_twitter_image_idx" ON "_posts_v" USING btree ("version_seo_twitter_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "case_studies_tags_order_idx" ON "case_studies_tags" USING btree ("_order");
  CREATE INDEX "case_studies_tags_parent_id_idx" ON "case_studies_tags" USING btree ("_parent_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "leads_services_interested_order_idx" ON "leads_services_interested" USING btree ("order");
  CREATE INDEX "leads_services_interested_parent_idx" ON "leads_services_interested" USING btree ("parent_id");
  CREATE INDEX "leads_assigned_user_idx" ON "leads" USING btree ("assigned_user_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "_leads_v_version_services_interested_order_idx" ON "_leads_v_version_services_interested" USING btree ("order");
  CREATE INDEX "_leads_v_version_services_interested_parent_idx" ON "_leads_v_version_services_interested" USING btree ("parent_id");
  CREATE INDEX "_leads_v_parent_idx" ON "_leads_v" USING btree ("parent_id");
  CREATE INDEX "_leads_v_version_version_assigned_user_idx" ON "_leads_v" USING btree ("version_assigned_user_id");
  CREATE INDEX "_leads_v_version_version_updated_at_idx" ON "_leads_v" USING btree ("version_updated_at");
  CREATE INDEX "_leads_v_version_version_created_at_idx" ON "_leads_v" USING btree ("version_created_at");
  CREATE INDEX "_leads_v_created_at_idx" ON "_leads_v" USING btree ("created_at");
  CREATE INDEX "_leads_v_updated_at_idx" ON "_leads_v" USING btree ("updated_at");
  CREATE INDEX "clients_lead_idx" ON "clients" USING btree ("lead_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "projects_client_idx" ON "projects" USING btree ("client_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "contracts_client_idx" ON "contracts" USING btree ("client_id");
  CREATE INDEX "contracts_updated_at_idx" ON "contracts" USING btree ("updated_at");
  CREATE INDEX "contracts_created_at_idx" ON "contracts" USING btree ("created_at");
  CREATE INDEX "files_client_idx" ON "files" USING btree ("client_id");
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE INDEX "meetings_client_idx" ON "meetings" USING btree ("client_id");
  CREATE INDEX "meetings_updated_at_idx" ON "meetings" USING btree ("updated_at");
  CREATE INDEX "meetings_created_at_idx" ON "meetings" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_contracts_id_idx" ON "payload_locked_documents_rels" USING btree ("contracts_id");
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_meetings_id_idx" ON "payload_locked_documents_rels" USING btree ("meetings_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_trust_logos_logos_order_idx" ON "homepage_trust_logos_logos" USING btree ("_order");
  CREATE INDEX "homepage_trust_logos_logos_parent_id_idx" ON "homepage_trust_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "homepage_problem_cards_order_idx" ON "homepage_problem_cards" USING btree ("_order");
  CREATE INDEX "homepage_problem_cards_parent_id_idx" ON "homepage_problem_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_manifesto_lines_order_idx" ON "homepage_manifesto_lines" USING btree ("_order");
  CREATE INDEX "homepage_manifesto_lines_parent_id_idx" ON "homepage_manifesto_lines" USING btree ("_parent_id");
  CREATE INDEX "homepage_process_steps_order_idx" ON "homepage_process_steps" USING btree ("_order");
  CREATE INDEX "homepage_process_steps_parent_id_idx" ON "homepage_process_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_services_items_order_idx" ON "homepage_services_items" USING btree ("_order");
  CREATE INDEX "homepage_services_items_parent_id_idx" ON "homepage_services_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_results_stats_order_idx" ON "homepage_results_stats" USING btree ("_order");
  CREATE INDEX "homepage_results_stats_parent_id_idx" ON "homepage_results_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_faq_items_order_idx" ON "homepage_faq_items" USING btree ("_order");
  CREATE INDEX "homepage_faq_items_parent_id_idx" ON "homepage_faq_items" USING btree ("_parent_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_case_studies_id_idx" ON "homepage_rels" USING btree ("case_studies_id");
  CREATE INDEX "homepage_rels_testimonials_id_idx" ON "homepage_rels" USING btree ("testimonials_id");
  CREATE INDEX "_homepage_v_version_trust_logos_logos_order_idx" ON "_homepage_v_version_trust_logos_logos" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_trust_logos_logos_parent_id_idx" ON "_homepage_v_version_trust_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_problem_cards_order_idx" ON "_homepage_v_version_problem_cards" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_problem_cards_parent_id_idx" ON "_homepage_v_version_problem_cards" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_manifesto_lines_order_idx" ON "_homepage_v_version_manifesto_lines" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_manifesto_lines_parent_id_idx" ON "_homepage_v_version_manifesto_lines" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_process_steps_order_idx" ON "_homepage_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_process_steps_parent_id_idx" ON "_homepage_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_services_items_order_idx" ON "_homepage_v_version_services_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_services_items_parent_id_idx" ON "_homepage_v_version_services_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_results_stats_order_idx" ON "_homepage_v_version_results_stats" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_results_stats_parent_id_idx" ON "_homepage_v_version_results_stats" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_faq_items_order_idx" ON "_homepage_v_version_faq_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_faq_items_parent_id_idx" ON "_homepage_v_version_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_case_studies_id_idx" ON "_homepage_v_rels" USING btree ("case_studies_id");
  CREATE INDEX "_homepage_v_rels_testimonials_id_idx" ON "_homepage_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "navigation_links_order_idx" ON "navigation_links" USING btree ("_order");
  CREATE INDEX "navigation_links_parent_id_idx" ON "navigation_links" USING btree ("_parent_id");
  CREATE INDEX "footer_service_links_order_idx" ON "footer_service_links" USING btree ("_order");
  CREATE INDEX "footer_service_links_parent_id_idx" ON "footer_service_links" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_same_as_order_idx" ON "site_settings_same_as" USING btree ("_order");
  CREATE INDEX "site_settings_same_as_parent_id_idx" ON "site_settings_same_as" USING btree ("_parent_id");
  CREATE INDEX "seo_settings_keywords_order_idx" ON "seo_settings_keywords" USING btree ("_order");
  CREATE INDEX "seo_settings_keywords_parent_id_idx" ON "seo_settings_keywords" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "case_studies_tags" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "leads_services_interested" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "_leads_v_version_services_interested" CASCADE;
  DROP TABLE "_leads_v" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "contracts" CASCADE;
  DROP TABLE "files" CASCADE;
  DROP TABLE "meetings" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_trust_logos_logos" CASCADE;
  DROP TABLE "homepage_problem_cards" CASCADE;
  DROP TABLE "homepage_manifesto_lines" CASCADE;
  DROP TABLE "homepage_process_steps" CASCADE;
  DROP TABLE "homepage_services_items" CASCADE;
  DROP TABLE "homepage_results_stats" CASCADE;
  DROP TABLE "homepage_faq_items" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_version_trust_logos_logos" CASCADE;
  DROP TABLE "_homepage_v_version_problem_cards" CASCADE;
  DROP TABLE "_homepage_v_version_manifesto_lines" CASCADE;
  DROP TABLE "_homepage_v_version_process_steps" CASCADE;
  DROP TABLE "_homepage_v_version_services_items" CASCADE;
  DROP TABLE "_homepage_v_version_results_stats" CASCADE;
  DROP TABLE "_homepage_v_version_faq_items" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "navigation_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "footer_service_links" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "site_settings_same_as" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "seo_settings_keywords" CASCADE;
  DROP TABLE "seo_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_leads_services_interested";
  DROP TYPE "public"."enum_leads_budget";
  DROP TYPE "public"."enum_leads_source";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_priority";
  DROP TYPE "public"."enum__leads_v_version_services_interested";
  DROP TYPE "public"."enum__leads_v_version_budget";
  DROP TYPE "public"."enum__leads_v_version_source";
  DROP TYPE "public"."enum__leads_v_version_status";
  DROP TYPE "public"."enum__leads_v_version_priority";
  DROP TYPE "public"."enum_homepage_services_items_icon";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_services_items_icon";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_footer_social_links_platform";`)
}
