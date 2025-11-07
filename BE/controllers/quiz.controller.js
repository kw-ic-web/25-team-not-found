import Joi from 'joi';
import * as QuizService from '../services/quiz.service.js';

const submitSchema = Joi.object({
    answers: Joi.array().items(Joi.object({
        question_id: Joi.number().integer().required(),
        student_answer: Joi.any().required(), // Answer can be of any type
    })).min(1).required(),
});

export const getQuizQuestions = async (req, res, next) => {
    try {
        const { quiz_id } = req.params;
        const questions = await QuizService.getQuizQuestions(quiz_id);
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        next(error);
    }
};

export const submitQuizAnswers = async (req, res, next) => {
    try {
        const { error, value } = submitSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = 'BAD_REQUEST';
            throw err;
        }

        const { quiz_id } = req.params;
        const userId = req.user.id;
        const { answers } = value;

        const result = await QuizService.submitQuizAnswers(userId, quiz_id, answers);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};
