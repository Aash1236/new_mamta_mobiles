/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow Cloudinary images
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Allow placeholder images
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org', // Allow brand logos
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Allow wikimedia (just in case)
      }
    ],
  },
};

export default nextConfig;