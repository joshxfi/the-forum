/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tf/codegen', '@tf/prisma'],
}

module.exports = nextConfig
