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
