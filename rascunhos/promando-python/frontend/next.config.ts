import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.alphacoders.com",
        port: "",
        pathname: "/**", // Allow images from this specific hostname
      },
      {
        protocol: "https",
        hostname: "assets.nuuvem.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sttc.gamersgate.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
