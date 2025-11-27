import pool from '../config/db.config.js';

export const findQuestionsByQuizId = async (quizId) => {
  const query = 'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_order';
  const { rows } = await pool.query(query, [quizId]);
  return rows;
};

export const createSubmission = async (client, userId, quizId) => {
  const query = 'INSERT INTO quiz_submissions (user_id, quiz_id) VALUES ($1, $2) RETURNING submission_id';
  const { rows } = await client.query(query, [userId, quizId]);
  return rows[0].submission_id;
};

export const findCorrectAnswer = async (client, questionId) => {
  const query = 'SELECT correct_answer FROM quiz_questions WHERE question_id = $1';
  const { rows } = await client.query(query, [questionId]);
  return rows[0]?.correct_answer;
};

export const createAnswer = async (client, submissionId, questionId, studentAnswer, isCorrect) => {
  const query = `
    INSERT INTO quiz_answers (submission_id, question_id, student_answer, is_correct)
    VALUES ($1, $2, $3, $4)
  `;
  await client.query(query, [submissionId, questionId, studentAnswer, isCorrect]);
};

export const updateSubmissionScore = async (client, submissionId, score) => {
  const query = 'UPDATE quiz_submissions SET score = $1, completed_at = now() WHERE submission_id = $2';
  await client.query(query, [score, submissionId]);
};

export const getQuizResults = async (submissionId) => {
  const query = `
        SELECT
            qq.question_id,
            qq.question_text,
            qq.options,
            qq.correct_answer,
            qq.explanation,
            qa.student_answer,
            qa.is_correct
        FROM quiz_questions qq
        JOIN quiz_answers qa ON qq.question_id = qa.question_id
        WHERE qa.submission_id = $1
        ORDER BY qq.question_order;
    `;
  const { rows } = await pool.query(query, [submissionId]);
  return rows;
};

export const getQuizStatsByUser = async (userId) => {
  const query = `
    SELECT
      COUNT(submission_id) as total_quizzes,
      COALESCE(AVG(score), 0) as average_score
    FROM quiz_submissions
    WHERE user_id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

export const getQuizStatsByTextbook = async (userId, textbookId) => {
  const query = `
    SELECT
      COUNT(qs.submission_id) as total_quizzes,
      COALESCE(AVG(qs.score), 0) as average_score
    FROM quiz_submissions qs
    JOIN quizzes q ON qs.quiz_id = q.quiz_id
    JOIN textbook_pages tp ON q.page_id = tp.page_id
    JOIN textbook_versions tv ON tp.version_id = tv.version_id
    WHERE qs.user_id = $1 AND tv.textbook_id = $2
  `;
  const { rows } = await pool.query(query, [userId, textbookId]);
  return rows[0];
};
