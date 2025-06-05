// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   transpilePackages: ["react-pdf"],
// };

// export default nextConfig;
// next.config.ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle canvas for PDF.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore canvas in client-side builds
    if (!isServer) {
      config.resolve.fallback.canvas = false;
    }

    return config;
  },
};

export default nextConfig;