/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@myface/ui', '@myface/types', '@myface/config'],
  reactStrictMode: true,
};

export default nextConfig;
