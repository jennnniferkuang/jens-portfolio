import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseRemotePatterns: NonNullable<
  NextConfig["images"]
>["remotePatterns"] = [];

if (supabaseUrl) {
  const storageUrl = new URL(supabaseUrl);

  supabaseRemotePatterns.push({
    protocol: storageUrl.protocol === "http:" ? "http" : "https",
    hostname: storageUrl.hostname,
    port: storageUrl.port,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow a 10 MB image plus multipart form overhead.
      bodySizeLimit: "11mb",
    },
  },
  images: {
    remotePatterns: supabaseRemotePatterns,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default withFlowbiteReact(nextConfig);
