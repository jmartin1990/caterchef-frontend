import type { NextConfig } from "next";

// Cambiamos el tipo para permitir las opciones extra de eslint y typescript
const nextConfig: any = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
