/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "aimsbay-project-manager.s3.us-east-2.amazonaws.com",
      "images.pexels.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pm-s3-images.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
