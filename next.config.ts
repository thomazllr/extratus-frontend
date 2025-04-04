/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // <-- isso aqui é o que expõe ao middleware
  },
};
export default nextConfig;
