const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'shared.fastly.steamstatic.com',
      'cdn1.epicgames.com',
      'images.squarespace-cdn.com',
      'miro.medium.com',
      'i.playground.ru',
      'images.gog-statics.com', // ✅ dominio agregado
      'cdn2.steamgriddb.com',
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
