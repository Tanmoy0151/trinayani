/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'],   // Allow placehold.co images
    dangerouslyAllowSVG: true, // Allow SVG images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Allow SVG images
  },
  // Configure allowed development origins
  allowedDevOrigins: [
    '192.168.0.106',
    '192.168.1.19', // Add your local IP address
    'localhost',
   
  ],
};

module.exports = nextConfig; 