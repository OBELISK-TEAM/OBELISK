import dotenv from 'dotenv';

// import environment variables from the '../.env' file
dotenv.config({ path: `../.env` });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {    // here we have to export all variables that are supposed to be used on client pages (those starting with 'use client')
    BACKEND_HOST: process.env.BACKEND_HOST,
    BACKEND_PORT: process.env.BACKEND_PORT,
    FRONTEND_HOST: process.env.FRONTEND_HOST,
    FRONTEND_PORT: process.env.FRONTEND_PORT
  },
};

export default nextConfig;
