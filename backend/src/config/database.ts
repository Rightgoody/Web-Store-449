import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import path from 'path';


const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const poolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

if (!poolConfig.user) {
    console.error('FATAL ERROR: Database .env variables not loaded.');
    console.error('Make sure you have a .env file in your /backend folder.');
    process.exit(1);
} else {
    console.log('.env file loaded. Connecting as user:', poolConfig.user);
}

export const pool = new Pool(poolConfig);

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params);
};

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});