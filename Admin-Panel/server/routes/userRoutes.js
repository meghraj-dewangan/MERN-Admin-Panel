import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  changeUserRole,
  toggleUserActive,
  getUsersByRole,
} from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/rbacMiddleware.js';
import validate from '../middlewares/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { createUserValidator, updateUserRoleValidator } from '../utils/validators.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Get users by role (needed by Manager to list Staff)
router.get('/role/:role', getUsersByRole);

// SuperAdmin-only routes
router.get('/', authorize(PERMISSIONS.VIEW_ALL_USERS), getAllUsers);
router.post('/', authorize(PERMISSIONS.CREATE_USER), createUserValidator, validate, createUser);
router.get('/:id', authorize(PERMISSIONS.VIEW_ALL_USERS), getUserById);
router.put('/:id/role', authorize(PERMISSIONS.CHANGE_USER_ROLE), updateUserRoleValidator, validate, changeUserRole);
router.put('/:id/toggle-active', authorize(PERMISSIONS.TOGGLE_USER_ACTIVE), toggleUserActive);

export default router;
