import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = [
    'PORT',
    'DATABASE_URL',
    'APP_URL',
    'FRONTEND_URL',
    'EMAIL_USER',
    'EMAIL_PASS',
    
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

export const config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
};

export default config;