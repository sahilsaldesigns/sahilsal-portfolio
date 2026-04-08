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
    const isDev = process.env.NODE_ENV === "development";
    const csp = [
      "default-src 'self'",
      // unsafe-eval needed in dev for React Fast Refresh (HMR)
      // localhost:4001 needed in dev for TinaCMS admin panel scripts
      // Both are omitted in production
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' http://localhost:4001 https://us-assets.i.posthog.com" : ""}`,
      // fonts.googleapis.com needed in dev for TinaCMS admin Google Fonts
      `style-src 'self' 'unsafe-inline'${isDev ? " https://fonts.googleapis.com" : ""}`,
      // fonts.gstatic.com needed in dev for TinaCMS admin Google Fonts files
      `font-src 'self' data:${isDev ? " https://fonts.gstatic.com" : ""}`,
      // Local assets + TinaCloud image CDN
      "img-src 'self' data: blob: https://assets.tina.io https://raw.githubusercontent.com https://content.tinajs.io",
      // Videos served from local /public
      "media-src 'self' blob:",
      // ws://localhost:4001 for Vite WebSocket HMR in dev
      // identity-v2.tinajs.io for TinaCMS auth/analytics in dev
      `connect-src 'self' https://*.tina.io${isDev ? " http://localhost:4001 ws://localhost:4001 https://identity-v2.tinajs.io https://us.i.posthog.com https://us-assets.i.posthog.com" : ""}`,
      // Block all plugin content (Flash, etc.)
      "object-src 'none'",
      // Prevent base tag hijacking
      "base-uri 'self'",
      // Restrict form submissions to same origin
      "form-action 'self'",
      // Allow same-origin framing in dev (TinaCMS admin iframes site pages for preview)
      `frame-ancestors ${isDev ? "'self'" : "'none'"}`,
    ].join("; ");

    return [
      // No CSP or framing restrictions on the admin panel
      {
        source: "/admin(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      // Strict security headers for all other routes
      {
        source: "/((?!admin).*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: isDev ? "SAMEORIGIN" : "DENY" },
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
