import type { NextConfig } from "next";

const backendUrl = process.env.APPLYFLOW_BACKEND_URL ?? "http://localhost:5267";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
