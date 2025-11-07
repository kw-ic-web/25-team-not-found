/**
 * Global error handler middleware.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
    },
  });
};

export default errorHandler;
