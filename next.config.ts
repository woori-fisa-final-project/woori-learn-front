import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    return [
      {
        source: "/education/:path*",
        destination: `${apiBaseUrl}/education/:path*`,
      },
    ];
  },
};

export default nextConfig;