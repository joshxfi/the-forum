/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@theforum/codegen', '@theforum/prisma'],
}

module.exports = nextConfig
