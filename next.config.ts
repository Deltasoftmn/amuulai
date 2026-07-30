import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amuulai.deltasoft.website",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "amuulai.deltasoft.website",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.deltasoft.website",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
