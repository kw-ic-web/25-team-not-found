import { createQuiz, getQuiz } from '../services/quiz-management.service.js';

export const createQuizController = async (req, res, next) => {
  try {
    const quizData = req.body;
    const userId = req.user.id;
    const quiz = await createQuiz(quizData, userId);
    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const getQuizController = async (req, res, next) => {
  try {
    const { page_id } = req.params;
    const quiz = await getQuiz(page_id);
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};