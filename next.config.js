/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      // TinaCloud media CDN
      {
        protocol: "https",
        hostname: "assets.tina.io",
      },
      // GitHub raw content (TinaCloud reads from repo)
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      // TinaCloud content API
      {
        protocol: "https",
        hostname: "content.tinajs.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
}
