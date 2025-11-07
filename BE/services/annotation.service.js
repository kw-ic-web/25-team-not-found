import * as AnnotationRepository from '../repositories/annotation.repository.js';

export const getAnnotations = async (userId, query) => {
  if (query.page_id) {
    return AnnotationRepository.findByPageId(userId, query.page_id);
  }
  if (query.textbook_id) {
    return AnnotationRepository.findByTextbookId(userId, query.textbook_id);
  }
  // Should not be reached due to controller validation, but as a fallback:
  return AnnotationRepository.findAllByUserId(userId);
};

export const createAnnotation = async (userId, annotationData) => {
  return AnnotationRepository.create(userId, annotationData);
};

export const updateAnnotation = async (userId, annotationId, annotationData) => {
  // The repository should handle checking ownership (userId)
  const updatedAnnotation = await AnnotationRepository.update(userId, annotationId, annotationData);
   if (!updatedAnnotation) {
      const error = new Error('Annotation not found or you do not have permission to update it.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
  }
  return updatedAnnotation;
};

export const deleteAnnotation = async (userId, annotationId) => {
  // The repository should handle checking ownership (userId)
  const success = await AnnotationRepository.remove(userId, annotationId);
  if (!success) {
      const error = new Error('Annotation not found or you do not have permission to delete it.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
  }
  return;
};
