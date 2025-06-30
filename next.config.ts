import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opciones de Next.js
  reactStrictMode: true,

  // Ignora errores de ESLint al hacer build (temporal)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Si usas imágenes externas (ajusta hostnames si hace falta)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
