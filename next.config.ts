import type { NextConfig } from 'next';
// import path from 'path';

// const securityHeaders = [
//   { key: 'X-Frame-Options', value: 'DENY' },
//   { key: 'X-Content-Type-Options', value: 'nosniff' },
//   { key: 'Referrer-Policy', value: 'no-referrer' },
//   {
//     key: 'Strict-Transport-Security',
//     value: 'max-age=63072000; includeSubDomains; preload',
//   },
//   {
//     key: 'Permissions-Policy',
//     value: 'camera=(), microphone=(), geolocation=()',
//   },
// ];

const nextConfig: NextConfig = {
  // output: 'standalone',
  // webpack: (config, { isServer }) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     'twitter-api-v2': false,
  //     'pino-pretty': false,
  //     '@react-native-async-storage/async-storage': false,
  //   };
  //   config.resolve.alias['~'] = path.join(__dirname, 'src');
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icm-bucket.sfo3.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
