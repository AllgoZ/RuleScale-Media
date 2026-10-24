import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "featured_image_url" varchar;
  ALTER TABLE "posts" ADD COLUMN "featured_image_alt" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_featured_image_url" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_featured_image_alt" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "featured_image_url";
  ALTER TABLE "posts" DROP COLUMN "featured_image_alt";
  ALTER TABLE "_posts_v" DROP COLUMN "version_featured_image_url";
  ALTER TABLE "_posts_v" DROP COLUMN "version_featured_image_alt";`)
}
