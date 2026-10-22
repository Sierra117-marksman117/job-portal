process.env.NEXT_TELEMETRY_DISABLED = "1";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  outputFileTracingIncludes: {
    '/**': ['./prisma/dev.db', './prisma/schema.prisma'],
  },
};

export default nextConfig;
