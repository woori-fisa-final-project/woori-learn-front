import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/education/:path*",
        destination: "http://localhost:8080/education/:path*",
      },
    ];
  },
};

export default nextConfig;
