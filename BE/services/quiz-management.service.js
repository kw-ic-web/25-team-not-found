import { createQuiz as createQuizRepository, getQuiz as getQuizRepository } from '../repositories/quiz-management.repository.js';

export const createQuiz = async (quizData, userId) => {
  try {
    return await createQuizRepository(quizData, userId);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getQuiz = async (page_id) => {
  try {
    return await getQuizRepository(page_id);
  } catch (error) {
    throw new Error(error.message);
  }
};