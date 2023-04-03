const fs = require('fs')

let privKey = undefined
let pubKey = undefined

try {
  privKey = fs.readFileSync('priv.key', 'utf8')
  pubKey = fs.readFileSync('pub.key', 'utf-8')
} catch (error) {
  console.error(error)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'fakestoreapi.com'
      }
    ]
  },
  env: {
    JWT_PRIV_KEY: privKey,
    JWT_PUB_KEY: pubKey
  }
}

module.exports = nextConfig
