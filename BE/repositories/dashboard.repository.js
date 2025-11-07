import pool from '../config/db.config.js';

export const findEnrollmentsByUserId = async (userId) => {
  const query = `
    SELECT t.* FROM textbooks t
    JOIN enrollments e ON t.textbook_id = e.textbook_id
    WHERE e.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const findRecentFeedbackByUserId = async (userId) => {
  const query = `
    SELECT * FROM teacher_feedback
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 5;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const findStatsByUserId = async (userId) => {
  // This is a complex query and might need adjustment based on the actual schema.
  const query = `
    SELECT
      AVG(qs.score) as average_score,
      COUNT(qs.submission_id) as quizzes_taken
    FROM quiz_submissions qs
    WHERE qs.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0]; // Expecting a single row of aggregated stats
};
