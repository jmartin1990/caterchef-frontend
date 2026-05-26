import type { NextConfig } from "next";

// Definimos una interfaz que extiende la configuración original de Next
interface CustomNextConfig extends NextConfig {
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
  typescript?: {
    ignoreBuildErrors?: boolean;
  };
}

const nextConfig: CustomNextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
