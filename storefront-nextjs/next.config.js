/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qehmrxrrtestgxvqjjze.supabase.co",
        pathname: "/storage/v1/object/public/products/**",
      },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "img.kwcdn.com" },
      { protocol: "https", hostname: "beadecorperu.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination:
          "https://qehmrxrrtestgxvqjjze.supabase.co/storage/v1/object/public/products/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
