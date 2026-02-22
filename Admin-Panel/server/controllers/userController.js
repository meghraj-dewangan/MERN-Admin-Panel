import * as userService from '../services/userService.js';
import * as ApiResponse from '../utils/apiResponse.js';

/**
 * 
 *    Get all users (SuperAdmin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return ApiResponse.success(res, { users }, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *    Get single user
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return ApiResponse.success(res, { user }, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *   Create a user (SuperAdmin)
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await userService.createUser({ name, email, password, role });
    return ApiResponse.created(res, { user }, 'User created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *    Change user role (SuperAdmin)
 */
const changeUserRole = async (req, res, next) => {
  try {
    const user = await userService.changeUserRole(req.params.id, req.body.role);
    return ApiResponse.success(res, { user }, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *    Toggle user active status (SuperAdmin)
 */
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await userService.toggleUserActive(req.params.id);
    return ApiResponse.success(
      res,
      { user },
      `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *   Get users by role
 */
const getUsersByRole = async (req, res, next) => {
  try {
    const users = await userService.getUsersByRole(req.params.role);
    return ApiResponse.success(res, { users }, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

export { getAllUsers, getUserById, createUser, changeUserRole, toggleUserActive, getUsersByRole };
