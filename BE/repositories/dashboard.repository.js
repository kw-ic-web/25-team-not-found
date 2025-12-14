
import pool from '../config/db.config.js';

/**
 * Get KPI Statistics
 * @param {number} userId 
 */
export const getKPIs = async (userId) => {
  const query = `
    WITH stats AS (
      SELECT 
        COALESCE(EXTRACT(EPOCH FROM SUM(ended_at - started_at)), 0) / 3600 as total_hours,
        COUNT(*) as completed_classes
      FROM sessions 
      WHERE user_id = $1 AND status = 'ended'
    )
    SELECT 
      COALESCE((SELECT total_hours FROM stats), 0) as total_hours,
      COALESCE((SELECT completed_classes FROM stats), 0) as completed_classes,
      (SELECT COUNT(*) FROM quiz_submissions WHERE user_id = $1) as quizzes_taken,
      (SELECT COALESCE(AVG(score), 0) FROM quiz_submissions WHERE user_id = $1) as average_score,
      u.weekly_goal_hours
    FROM users u
    WHERE u.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0] || { total_hours: 0, completed_classes: 0, quizzes_taken: 0, average_score: 0 };
};

/**
 * Get Weekly Learning Trend (Last 7 Days)
 * @param {number} userId 
 */
export const getWeeklyTrend = async (userId) => {
  const query = `
    WITH dates AS (
      SELECT generate_series(
        current_date - interval '6 days', 
        current_date, 
        '1 day'::interval
      )::date AS date
    )
    SELECT 
      to_char(d.date, 'Mon DD') as date,
      COALESCE(EXTRACT(EPOCH FROM SUM(s.ended_at - s.started_at)), 0) / 3600 as hours
    FROM dates d
    LEFT JOIN sessions s ON s.user_id = $1 
      AND s.started_at::date = d.date 
      AND s.status = 'ended'
    GROUP BY d.date
    ORDER BY d.date;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

/**
 * Get Quiz Score Distribution
 * @param {number} userId 
 */
export const getScoreDistribution = async (userId) => {
  const query = `
    SELECT 
      width_bucket(score, 0, 100, 5) as bucket,
      COUNT(*) as count
    FROM quiz_submissions
    WHERE user_id = $1
    GROUP BY bucket
    ORDER BY bucket;
  `;
  const { rows } = await pool.query(query, [userId]);

  // Format to specific ranges for UI
  const ranges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
  const distribution = Array(5).fill(0);

  rows.forEach(row => {
    if (row.bucket >= 1 && row.bucket <= 5) {
      distribution[row.bucket - 1] = parseInt(row.count);
    }
  });

  return ranges.map((range, i) => ({ range, count: distribution[i] }));
};

/**
 * Get Enrolled Textbooks with Progress
 * @param {number} userId 
 */
export const getTextbookProgress = async (userId) => {
  const query = `
    SELECT 
        t.textbook_id,
        t.title,
        t.author_id,
        (
            SELECT COUNT(DISTINCT tp.page_id) 
            FROM textbook_pages tp
            JOIN textbook_versions tv ON tp.version_id = tv.version_id
            WHERE tv.textbook_id = t.textbook_id AND tv.is_published = true
        ) as total_pages,
        (
            SELECT COUNT(DISTINCT pr.page_id)
            FROM page_reads pr
            JOIN textbook_pages tp ON pr.page_id = tp.page_id
            JOIN textbook_versions tv ON tp.version_id = tv.version_id
            WHERE pr.user_id = $1 
            AND tv.textbook_id = t.textbook_id
        ) as read_pages
    FROM enrollments e
    JOIN textbooks t ON e.textbook_id = t.textbook_id
    WHERE e.user_id = $1;
  `;
  const { rows } = await pool.query(query, [userId]);

  return rows.map(row => ({
    id: row.textbook_id,
    title: row.title,
    progress: row.total_pages > 0 ? Math.round((row.read_pages / row.total_pages) * 100) : 0,
    last_accessed: row.last_accessed // Note: logic might be needed if not in select
  }));
};

/**
 * Get Study Streak and Calendar Data
 * @param {number} userId 
 */
export const getStudyActivity = async (userId) => {
  // Combine sessions and page reads for activity heatmap
  const query = `
    WITH activity AS (
      SELECT started_at::date as date FROM sessions WHERE user_id = $1
      UNION ALL
      SELECT last_read_at::date as date FROM page_reads WHERE user_id = $1
      UNION ALL
      SELECT submitted_at::date as date FROM quiz_submissions WHERE user_id = $1
    )
    SELECT 
      date, 
      COUNT(*) as count 
    FROM activity 
    GROUP BY date
    ORDER BY date DESC
    LIMIT 90;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};
