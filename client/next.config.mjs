
import dotenv from "dotenv";


dotenv.config({ path: `../.env` });

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {

        SERVER_HOST: process.env.SERVER_HOST,
        SERVER_PORT: process.env.SERVER_PORT,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
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
