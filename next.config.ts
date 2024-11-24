import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hearty-toad-916.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
