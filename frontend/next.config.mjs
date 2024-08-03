import dotenv from 'dotenv';

dotenv.config({ path: `../.env` });

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/auth/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin-allow-popups',
                    }
                ],
            },
        ];
    },
    env: {
      BACKEND_HOST: process.env.BACKEND_HOST,
      BACKEND_PORT: process.env.BACKEND_PORT
    },
    async headers() {
        return [
            {
                source: '/auth/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin-allow-popups',
                    }
                ],
            },
        ];
    },
};

export default nextConfig;
