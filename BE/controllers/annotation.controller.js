import Joi from 'joi';
import * as AnnotationService from '../services/annotation.service.js';

const querySchema = Joi.object({
  page_id: Joi.number().integer(),
  textbook_id: Joi.number().integer(),
}).or('page_id', 'textbook_id'); // At least one is required

const bodySchema = Joi.object({
    page_id: Joi.number().integer().required(),
    annotation_type: Joi.string().valid('memo', 'highlight', 'edit_suggestion').required(),
    content: Joi.string().required(),
    location_data: Joi.object().required(),
});

export const getAnnotations = async (req, res, next) => {
    try {
        const { error, value } = querySchema.validate(req.query);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = 'BAD_REQUEST';
            throw err;
        }
        const annotations = await AnnotationService.getAnnotations(req.user.id, value);
        res.status(200).json({ success: true, data: annotations });
    } catch (error) {
        next(error);
    }
};

export const createAnnotation = async (req, res, next) => {
    try {
        const { error, value } = bodySchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = 'BAD_REQUEST';
            throw err;
        }
        const newAnnotation = await AnnotationService.createAnnotation(req.user.id, value);
        res.status(201).json({ success: true, data: newAnnotation });
    } catch (error) {
        next(error);
    }
};

export const updateAnnotation = async (req, res, next) => {
    try {
        // For simplicity, assuming the same body schema for update.
        // A more specific schema could be used here.
        const { error, value } = bodySchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            err.code = 'BAD_REQUEST';
            throw err;
        }
        const { annotation_id } = req.params;
        const updatedAnnotation = await AnnotationService.updateAnnotation(req.user.id, annotation_id, value);
        res.status(200).json({ success: true, data: updatedAnnotation });
    } catch (error) {
        next(error);
    }
};

export const deleteAnnotation = async (req, res, next) => {
    try {
        const { annotation_id } = req.params;
        await AnnotationService.deleteAnnotation(req.user.id, annotation_id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
