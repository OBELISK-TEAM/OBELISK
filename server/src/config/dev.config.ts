// file to store default values for the app
// these values are used in development
// they are not used in production

// main.ts

export const DEFAULT_SERVER_HOST = 'localhost';
export const DEFAULT_SERVER_PORT = 8080;
export const DEFAULT_GW_PORT = 8081;

export const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

// mongo.module.ts

export const DEFAULT_DB_HOST = 'localhost';

// auth.module.ts + jwt.strategy

export const DEFAULT_JWT_SECRET = 'secret';
export const DEFAULT_JWT_EXPIRES_IN = '14d';

// google.strategy.ts

export const DEFAULT_GOOGLE_CLIENT_ID = 'client';
export const DEFAULT_GOOGLE_CLIENT_SECRET = 'secret';
export const DEFAULT_GOOGLE_CALLBACK_URL = 'https://localhost:3000/sth';

// boards.service.ts

export const DEFAULT_MAX_BOARD_SIZE_IN_BYTES = 1;
