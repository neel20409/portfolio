import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Forces Next.js to properly compile the Motion library
  transpilePackages: ["motion"],
};

export default nextConfig;