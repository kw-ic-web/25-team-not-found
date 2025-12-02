import pool from '../config/db.config.js';

export const findEnrollmentsByUserId = async (userId) => {
  const query = `
    SELECT 
      t.textbook_id, 
      t.title, 
      t.author_id,
      e.role,
      e.last_accessed,
      -- Calculate Progress
      (
        SELECT COUNT(*)::float / NULLIF((
          SELECT COUNT(*) 
          FROM textbook_pages tp 
          WHERE tp.version_id = (
            SELECT version_id 
            FROM textbook_versions 
            WHERE textbook_id = t.textbook_id 
            ORDER BY version DESC 
            LIMIT 1
          )
        ), 0) * 100
        FROM page_reads pr
        JOIN textbook_pages tp ON pr.page_id = tp.page_id
        JOIN textbook_versions tv ON tp.version_id = tv.version_id
        WHERE pr.user_id = $1 AND tv.textbook_id = t.textbook_id
      ) as progress_rate,
      -- Calculate Quiz Average
      (
        SELECT COALESCE(AVG(qs.score), 0)
        FROM quiz_submissions qs
        JOIN quizzes q ON qs.quiz_id = q.quiz_id
        JOIN textbook_pages tp ON q.page_id = tp.page_id
        JOIN textbook_versions tv ON tp.version_id = tv.version_id
        WHERE qs.user_id = $1 AND tv.textbook_id = t.textbook_id
      ) as quiz_average_score
    FROM textbooks t
    JOIN enrollments e ON t.textbook_id = e.textbook_id
    WHERE e.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const findRecentFeedbackByUserId = async (userId) => {
  const query = `
    SELECT tf.*, t.title as textbook_title, u.nickname as teacher_name
    FROM teacher_feedback tf
    LEFT JOIN textbooks t ON tf.related_textbook_id = t.textbook_id
    LEFT JOIN users u ON tf.teacher_id = u.user_id
    WHERE tf.user_id = $1
    ORDER BY tf.created_at DESC
    LIMIT 5;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const findStatsByUserId = async (userId) => {
  const query = `
    SELECT
      COALESCE(AVG(qs.score), 0) as average_score,
      COUNT(qs.submission_id) as quizzes_taken,
      (SELECT COUNT(*) FROM page_reads WHERE user_id = $1) as total_pages_read
    FROM quiz_submissions qs
    WHERE qs.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

export const findTeacherTextbooks = async (teacherId) => {
  const query = `
    SELECT 
      t.textbook_id, 
      t.title, 
      t.created_at,
      (SELECT COUNT(*) FROM enrollments e WHERE e.textbook_id = t.textbook_id AND e.role = 'student') as student_count
    FROM textbooks t
    WHERE t.author_id = $1
    ORDER BY t.created_at DESC;
  `;
  const { rows } = await pool.query(query, [teacherId]);
  return rows;
};
