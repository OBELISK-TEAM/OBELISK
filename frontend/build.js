// chat GPT generated
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables from the custom .env file, which is in the root of this repository (NOT of this Next.js project)
dotenv.config({ path: '../.env' });

// Start the Next.js server
execSync(`next build`, { stdio: 'inherit' });
