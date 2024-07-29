// chat GPT generated
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables from the custom .env file, which is in the root of this repository (NOT of this Next.js project)
dotenv.config({ path: '../.env' });

// Get the port from the environment variables
const port = process.env.FRONTEND_PORT || 3000;
const host = process.env.FRONTEND_HOST || 'localhost';

// Start the Next.js server
execSync(`next start -H ${host} -p ${port}`, { stdio: 'inherit' });
