import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
      ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [
            { hostname: 'img.clerk.com'},
            { hostname: 'images.unsplash.com'},
            { hostname: 'avatars.githubusercontent.com'}
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },
    // Enable standalone output for Docker
    output: 'standalone',
    experimental: {
        // Enable optimizePackageImports for better bundle size
        optimizePackageImports: ['@radix-ui/react-accordion', '@radix-ui/react-select', 'lucide-react'],
    },
    // Enable compression
    compress: true,
};

export default nextConfig;