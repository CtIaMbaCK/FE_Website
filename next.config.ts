import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
        port: "",
        pathname: "/**", // Bạn cũng đang dùng cloudinary cho các ảnh thật nên tôi add luôn để dự phòng
      },
    ],
  },
};

export default nextConfig;
