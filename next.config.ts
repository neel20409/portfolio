import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "framer-motion", "framer-motion-3d"],
  // Remove the 'experimental.turbo' block if it continues to cause warnings
};

export default nextConfig;