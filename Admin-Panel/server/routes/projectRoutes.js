import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
  assignProject,
} from '../controllers/projectController.js';
import protect from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/rbacMiddleware.js';
import validate from '../middlewares/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import {
  createProjectValidator,
  updateProjectStatusValidator,
  assignProjectValidator,
} from '../utils/validators.js';

const router = express.Router();

// All project routes require authentication
router.use(protect);

// Create project (SuperAdmin, Manager)
router.post(
  '/',
  authorize(PERMISSIONS.CREATE_PROJECT),
  createProjectValidator,
  validate,
  createProject
);

// Get projects (filtered by role in controller)
router.get('/', getProjects);

// Get single project
router.get('/:id', getProjectById);

// Update project status (Staff, SuperAdmin)
router.put(
  '/:id/status',
  authorize(PERMISSIONS.UPDATE_PROJECT_STATUS),
  updateProjectStatusValidator,
  validate,
  updateProjectStatus
);

// Assign project to staff (Manager, SuperAdmin)
router.put(
  '/:id/assign',
  authorize(PERMISSIONS.ASSIGN_PROJECT),
  assignProjectValidator,
  validate,
  assignProject
);

export default router;
