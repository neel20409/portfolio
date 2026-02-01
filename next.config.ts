import type { NextConfig } from "next";

const nextConfig: any = {
  transpilePackages: ["motion"],
  experimental: {
    turbo: {
      resolveAlias: {
        "motion/react-three": "motion/react-three",
      },
    },
  },
};

export default nextConfig;