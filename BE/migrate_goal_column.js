
import pool from './config/db.config.js';

const migrate = async () => {
    try {
        console.log('Running migration...');
        const query = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS weekly_goal_hours INTEGER DEFAULT 5;
    `;
        await pool.query(query);
        console.log('Migration successful: weekly_goal_hours column added.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
};

migrate();
