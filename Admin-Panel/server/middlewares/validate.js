import { validationResult } from 'express-validator';
import * as ApiResponse from '../utils/apiResponse.js';

/**
 * Middleware to handle express-validator results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => err.msg);
    return ApiResponse.badRequest(res, 'Validation failed', extractedErrors);
  }
  next();
};

export default validate;
