import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    useCache:true
  },
  devIndicators:false,
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"*"
      }
    ]
  }
};

export default nextConfig;
