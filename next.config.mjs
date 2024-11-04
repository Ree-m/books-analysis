/** @type {import('next').NextConfig} */
import withLlamaIndex from "llamaindex/next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gutenberg.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.jp",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withLlamaIndex(nextConfig);
