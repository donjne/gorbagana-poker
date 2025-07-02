import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also disable TypeScript errors during builds if needed
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
