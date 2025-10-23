/** @type {import('next').NextConfig} */

module.exports = {
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
      {
        source: "/case-study",
        destination: "/case-study/project-1"
      }
    ];
  },
}
