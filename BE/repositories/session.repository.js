import pool from '../config/db.config.js';

export const findSessionByCode = async (code) => {
  const query = 'SELECT * FROM sessions WHERE invitation_code = $1';
  const { rows } = await pool.query(query, [code]);
  return rows[0];
};

export const updateSessionUser = async (sessionId, userId, status) => {
  const query = `
    UPDATE sessions
    SET user_id = $1, status = $2, started_at = now()
    WHERE session_id = $3
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [userId, status, sessionId]);
  return rows[0];
};
