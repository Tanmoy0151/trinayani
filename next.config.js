/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true, // This tells Next.js to accept SVG images even though they can potentially contain scripts
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", //This CSP prevents any scripts from running in the SVG and applies sandbox restrictions
  },
  // Configure allowed development origins
  allowedDevOrigins: [
    '192.168.0.106',
    '192.168.1.19', // Add your local IP address
    'localhost',
   
  ],
};

module.exports = nextConfig; 