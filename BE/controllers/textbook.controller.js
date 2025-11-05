import Joi from 'joi';
import * as TextbookService from '../services/textbook.service.js';

const paramsSchema = Joi.object({
  textbook_id: Joi.number().integer().required(),
  page_number: Joi.number().integer().required(),
});

export const getPageContent = async (req, res, next) => {
  try {
    const { error, value } = paramsSchema.validate(req.params);
    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 400;
      err.code = 'BAD_REQUEST';
      throw err;
    }

    const { textbook_id, page_number } = value;
    const pageContent = await TextbookService.getPageContent(req.user.id, textbook_id, page_number);

    res.status(200).json({ success: true, data: pageContent });
  } catch (error) {
    next(error);
  }
};
