import * as TextbookRepository from '../repositories/textbook.repository.js';

export const getPageContent = async (userId, textbookId, pageNumber) => {
  // Here we could add logic to check if the user is enrolled in the textbook.
  // For now, we'll just fetch the content.
  const pageContent = await TextbookRepository.findPageContent(textbookId, pageNumber);
  if (!pageContent) {
      const error = new Error('Page not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
  }
  return pageContent;
};
