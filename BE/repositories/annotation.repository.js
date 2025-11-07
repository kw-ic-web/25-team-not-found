import pool from '../config/db.config.js';

export const findByPageId = async (userId, pageId) => {
    const query = 'SELECT * FROM user_annotations WHERE user_id = $1 AND page_id = $2';
    const { rows } = await pool.query(query, [userId, pageId]);
    return rows;
};

export const findByTextbookId = async (userId, textbookId) => {
    const query = `
        SELECT a.* FROM user_annotations a
        JOIN textbook_pages p ON a.page_id = p.page_id
        WHERE a.user_id = $1 AND p.textbook_id = $2;
    `;
    const { rows } = await pool.query(query, [userId, textbookId]);
    return rows;
};

export const findAllByUserId = async (userId) => {
    const query = 'SELECT * FROM user_annotations WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    return rows;
};

export const create = async (userId, annotationData) => {
    const { page_id, annotation_type, content, location_data } = annotationData;
    const query = `
        INSERT INTO user_annotations (user_id, page_id, annotation_type, content, location_data)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, page_id, annotation_type, content, location_data]);
    return rows[0];
};

export const update = async (userId, annotationId, annotationData) => {
    const { content, location_data } = annotationData; // Assuming only these can be updated
    const query = `
        UPDATE user_annotations
        SET content = $1, location_data = $2, updated_at = now()
        WHERE annotation_id = $3 AND user_id = $4
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [content, location_data, annotationId, userId]);
    return rows[0]; // Returns updated row or undefined if not found/not owner
};

export const remove = async (userId, annotationId) => {
    const query = 'DELETE FROM user_annotations WHERE annotation_id = $1 AND user_id = $2';
    const result = await pool.query(query, [annotationId, userId]);
    return result.rowCount > 0; // Returns true if a row was deleted
};
