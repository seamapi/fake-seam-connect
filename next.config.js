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
          // Only allow API Routes and serve those from the root.
          // https://nextjs.org/docs/api-routes/introduction
          source: "/:path*",
          destination: "/api/:path*",
        },
      ],
    }
  },
}
