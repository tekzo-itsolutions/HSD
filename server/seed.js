import { initDatabase } from './config/db.js';

const pool = await initDatabase();
await pool.end();