import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "motion"],
  // Remove the 'experimental.turbo' block if it continues to cause warnings
};

export default nextConfig;