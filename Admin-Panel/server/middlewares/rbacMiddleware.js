import { hasPermission } from '../config/permissions.js';
import * as ApiResponse from '../utils/apiResponse.js';

/**
 * RBAC Middleware — checks permission.
 *
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    const userRole = req.user.role;

    // Check that the user's role has ALL required permissions
    const hasAll = requiredPermissions.every((perm) => hasPermission(userRole, perm));

    if (!hasAll) {
      return ApiResponse.forbidden(
        res,
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
      );
    }

    next();
  };
};

export default authorize;
