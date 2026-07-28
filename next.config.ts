import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
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