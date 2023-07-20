/** @type {import('next').NextConfig} */
export default {
  // UPSTREAM: https://github.com/vercel/next.js/discussions/32237#discussioncomment-4793595
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          destination: "/api/:path*",
        },
      ],
      fallback: [
        {
          source: "/api/:path*",
          destination: "/:path*",
        },
        {
          source: "/api",
          destination: "/",
        },
      ],
    }
  },
}
