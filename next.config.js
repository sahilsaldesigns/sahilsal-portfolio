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
    const csp = [
      "default-src 'self'",
      // Next.js requires unsafe-inline for hydration scripts; inline styles needed for Tailwind + Framer Motion
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      // Self-hosted via next/font; data: for icon fonts
      "font-src 'self' data:",
      // Local assets + TinaCloud image CDN
      "img-src 'self' data: blob: https://assets.tina.io https://raw.githubusercontent.com https://content.tinajs.io",
      // Videos served from local /public
      "media-src 'self' blob:",
      // API calls to TinaCloud only
      "connect-src 'self' https://*.tina.io",
      // Block all plugin content (Flash, etc.)
      "object-src 'none'",
      // Prevent base tag hijacking
      "base-uri 'self'",
      // Restrict form submissions to same origin
      "form-action 'self'",
      // Block this site from being embedded in any iframe
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
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
