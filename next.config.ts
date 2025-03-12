import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.
const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: false,
  reloadOnOnline: true,
  additionalPrecacheEntries: [{ url: "/offline", revision }],
});

const nextConfig: NextConfig = withSerwist({
  /* config options here */
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL!, // Set your origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  compiler: {
    // Remove console logs only in production, excluding error logs
    // removeConsole:
    //   process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
});

export default nextConfig;
