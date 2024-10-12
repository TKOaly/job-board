import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as relations from './relations';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export default drizzle(pool, {
  schema: { ...schema, ...relations },
  logger: true,
});
