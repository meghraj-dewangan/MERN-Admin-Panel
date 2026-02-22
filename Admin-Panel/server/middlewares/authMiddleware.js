import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import * as ApiResponse from '../utils/apiResponse.js';

/**
 * Protect routes — require valid JWT
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.unauthorized(res, 'Not authorized — no token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return ApiResponse.unauthorized(res, 'User no longer exists');
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Your account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired — please login again');
    }
    return ApiResponse.error(res, 'Authentication failed');
  }
};

export default protect;
