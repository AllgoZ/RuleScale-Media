import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Authors } from "./payload/collections/authors";
import { CaseStudies } from "./payload/collections/case-studies";
import { Categories } from "./payload/collections/categories";
import { Leads } from "./payload/collections/leads";
import { Media } from "./payload/collections/media";
import { Posts } from "./payload/collections/posts";
import { Testimonials } from "./payload/collections/testimonials";
import { Users } from "./payload/collections/users";
import { Footer } from "./payload/globals/footer";
import { Homepage } from "./payload/globals/homepage";
import { Navigation } from "./payload/globals/navigation";
import { SEOSettings } from "./payload/globals/seo-settings";
import { SiteSettings } from "./payload/globals/site-settings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Authors,
    Posts,
    Testimonials,
    CaseStudies,
    Leads,
  ],
  globals: [Homepage, Navigation, Footer, SiteSettings, SEOSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
});
