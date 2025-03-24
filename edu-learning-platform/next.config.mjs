/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
  output: 'export',
  distDir: 'out',
  // This ensures the app works properly on Netlify
  trailingSlash: true,
};

export default nextConfig;
