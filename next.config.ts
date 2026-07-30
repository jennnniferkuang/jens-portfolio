import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow a 10 MB image plus multipart form overhead.
      bodySizeLimit: "11mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "PROJECT_REF.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default withFlowbiteReact(nextConfig);
