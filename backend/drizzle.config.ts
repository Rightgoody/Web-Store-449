import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'webstore_user',
    password: process.env.DB_PASSWORD || 'webstore_password',
    database: process.env.DB_NAME || 'webstore_449',
    ssl: false,
  },
} satisfies Config;

