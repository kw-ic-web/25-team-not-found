import pool from './config/db.config.js';

async function migrate() {
    try {
        console.log("Adding original_page_id column...");
        await pool.query("ALTER TABLE textbook_pages ADD COLUMN IF NOT EXISTS original_page_id UUID;");

        console.log("Populating original_page_id...");
        await pool.query("UPDATE textbook_pages SET original_page_id = page_id WHERE original_page_id IS NULL;");

        console.log("Setting NOT NULL constraint...");
        await pool.query("ALTER TABLE textbook_pages ALTER COLUMN original_page_id SET NOT NULL;");

        console.log("Migration successful!");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await pool.end();
    }
}

migrate();
