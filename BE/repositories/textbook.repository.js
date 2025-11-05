import pool from '../config/db.config.js';

export const findPageContent = async (textbookId, pageNumber) => {
  const query = `
    SELECT content FROM textbook_pages
    WHERE textbook_id = $1 AND page_number = $2;
  `;
  const { rows } = await pool.query(query, [textbookId, pageNumber]);
  return rows[0]; // Returns the page object or undefined
};
