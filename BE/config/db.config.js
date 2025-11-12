import pg from 'pg';
import './index.js'; // Ensure dotenv is configured

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
