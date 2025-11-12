import Joi from 'joi';
import * as SessionService from '../services/session.service.js';

const joinSchema = Joi.object({
    invitation_code: Joi.string().required(),
});

export const joinSession = async (req, res, next) => {
    try {
        const { error, value } = joinSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = 'BAD_REQUEST';
            throw err;
        }

        const userId = req.user.id;
        const { invitation_code } = value;

        const sessionInfo = await SessionService.joinSession(userId, invitation_code);
        res.status(200).json({ success: true, data: sessionInfo });
    } catch (error) {
        next(error);
    }
};
