import pool from '../config/db.config.js';
import * as QuizRepository from '../repositories/quiz.repository.js';

export const getQuizQuestions = async (quizId) => {
  const questions = await QuizRepository.findQuestionsByQuizId(quizId);
  // Security: Remove sensitive fields before sending to the client
  return questions.map(({ correct_answer, explanation, ...question }) => question);
};

export const submitQuizAnswers = async (userId, quizId, answers) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create a submission record
    const submissionId = await QuizRepository.createSubmission(client, userId, quizId);

    let correctCount = 0;

    // 2. Process all answers
    const answerProcessingPromises = answers.map(async (answer) => {
      const { question_id, student_answer } = answer;
      const correctAnswer = await QuizRepository.findCorrectAnswer(client, question_id);

      const isCorrect = correctAnswer === student_answer;
      if (isCorrect) {
        correctCount++;
      }

      await QuizRepository.createAnswer(client, submissionId, question_id, student_answer, isCorrect);
    });

    await Promise.all(answerProcessingPromises);

    // 3. Calculate score and update submission
    const score = (correctCount / answers.length) * 100;
    await QuizRepository.updateSubmissionScore(client, submissionId, score);

    await client.query('COMMIT');

    // 4. Return the final results (including answers and explanations)
    const finalResults = await QuizRepository.getQuizResults(submissionId);
    return { submissionId, score, ...finalResults };

  } catch (error) {
    await client.query('ROLLBACK');
    // Re-throw the error to be caught by the global error handler
    throw error;
  } finally {
    client.release();
  }
};
