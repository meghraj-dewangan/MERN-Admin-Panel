import * as ApiResponse from '../utils/apiResponse.js';

/**
 * Centralized error handling middleware.
 */
const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.badRequest(res, `Duplicate value for ${field}. Please use another value.`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.badRequest(res, 'Validation failed', errors);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return ApiResponse.badRequest(res, `Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token expired');
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return ApiResponse.error(res, message, statusCode);
};

export default errorHandler;
