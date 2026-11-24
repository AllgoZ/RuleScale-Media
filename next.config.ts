import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const ONE_DAY = 60 * 60 * 24;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Portfolio/blog art changes rarely; keep optimised variants for 30 days instead of the
    // 4-hour default so the optimiser (and Cloudinary origin) is hit far less often.
    minimumCacheTTL: ONE_DAY * 30,
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    // Smaller client bundles: import only the icons / primitives actually used.
    optimizePackageImports: ["lucide-react", "@radix-ui/react-accordion"],
    // Static generation of ~70 detail pages talks to ONE Postgres with a 15-session cap
    // (see handover.md). Keep build concurrency low so the build can't exhaust it.
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
  },
  async rewrites() {
    return {
      // `/blog?page=N` (N >= 2) is served by the prerendered /blog/page/N route; the URL the
      // visitor sees and the pagination links stay `/blog?page=N`.
      beforeFiles: [
        {
          source: "/blog",
          has: [{ type: "query" as const, key: "page", value: "(?<n>[2-9]|[1-9][0-9]+)" }],
          destination: "/blog/page/:n",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        // Brand mark is referenced by name from public/, which Next serves with no-cache by default.
        source: "/logo.png",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_DAY * 7}, stale-while-revalidate=${ONE_DAY * 30}`,
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
