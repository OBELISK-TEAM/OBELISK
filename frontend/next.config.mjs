import dotenv from 'dotenv';

dotenv.config({ path: `../.env` });

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      BACKEND_HOST: process.env.BACKEND_HOST,
      BACKEND_PORT: process.env.BACKEND_PORT
    },
};

export default nextConfig;
