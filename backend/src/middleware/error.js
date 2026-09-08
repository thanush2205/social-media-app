/**
 * 404 handler for unknown API routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Centralized error handler. Every rejected async route lands here.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose: malformed ObjectId.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  // Mongoose: invalid field value.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose: duplicate unique field.
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  // Multer errors.
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };