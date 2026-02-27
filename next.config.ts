import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
  ],
};

export default nextConfig;
