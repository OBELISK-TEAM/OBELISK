import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// current module file
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../.env` });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {    // here we have to export all variables that are supposed to be used on client pages (those starting with 'use client')
    FRONTEND_HOST: process.env.FRONTEND_HOST,
    FRONTEND_PORT: process.env.FRONTEND_PORT,
    DB_NAME: process.env.DB_NAME
  },
};

export default nextConfig;
