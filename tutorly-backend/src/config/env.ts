import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = [
    'PORT',
    'DATABASE_URL',
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

export const config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL
};

export default config;