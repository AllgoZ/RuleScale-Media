import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Authors } from "./payload/collections/authors";
import { CaseStudies } from "./payload/collections/case-studies";
import { Categories } from "./payload/collections/categories";
import { Clients } from "./payload/collections/clients";
import { Contracts } from "./payload/collections/contracts";
import { Files } from "./payload/collections/files";
import { InfluencerApplications } from "./payload/collections/influencer-applications";
import { Leads } from "./payload/collections/leads";
import { Media } from "./payload/collections/media";
import { Meetings } from "./payload/collections/meetings";
import { Portfolio } from "./payload/collections/portfolio";
import { Posts } from "./payload/collections/posts";
import { Projects } from "./payload/collections/projects";
import { Tags } from "./payload/collections/tags";
import { Testimonials } from "./payload/collections/testimonials";
import { Users } from "./payload/collections/users";
import { Footer } from "./payload/globals/footer";
import { Homepage } from "./payload/globals/homepage";
import { Navigation } from "./payload/globals/navigation";
import { SEOSettings } from "./payload/globals/seo-settings";
import { SiteSettings } from "./payload/globals/site-settings";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ["@/payload/admin-views/dashboard-nav-link#BusinessDashboardNavLink"],
      views: {
        businessDashboard: {
          Component: "@/payload/admin-views/business-dashboard#BusinessDashboardView",
          path: "/business-dashboard",
          exact: true,
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Authors,
    Posts,
    Tags,
    Testimonials,
    CaseStudies,
    Portfolio,
    Leads,
    InfluencerApplications,
    Clients,
    Projects,
    Contracts,
    Files,
    Meetings,
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
    // Schema auto-push (drizzle-kit push) is hard-disabled by Payload whenever
    // NODE_ENV === "production" (confirmed in @payloadcms/db-postgres's own
    // connect.js) — Vercel always sets that, so without prodMigrations wired up,
    // production never applies schema changes at all, only ever reads/writes
    // against whatever the database already happens to have.
    prodMigrations: migrations,
    // Local dev and production point at the *same* Supabase database (confirmed
    // by the user), so dev-mode auto-push must stay off everywhere, not just in
    // production. Without this, every local `npm run dev` boot (or any script
    // that calls getPayload()) re-inserts a `{name: "dev", batch: -1}` marker
    // into payload_migrations, which makes Payload's migrate() try to show an
    // interactive "you used dev mode, data loss will occur" confirmation prompt
    // on the next Vercel build — unanswerable in a non-interactive build, hard
    // crash. Real schema changes now go through `payload migrate:create` +
    // committed migration files, same as production.
    push: false,
  }),
  sharp,
});
