import { body } from 'express-validator';
import { ROLES } from '../config/permissions.js';

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const createUserValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),
];

const updateUserRoleValidator = [
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),
];

const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Invalid user ID for assignedTo'),
];

const updateProjectStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected'),
];

const assignProjectValidator = [
  body('assignedTo')
    .notEmpty().withMessage('assignedTo is required')
    .isMongoId().withMessage('Invalid user ID'),
];

export {
  registerValidator,
  loginValidator,
  createUserValidator,
  updateUserRoleValidator,
  createProjectValidator,
  updateProjectStatusValidator,
  assignProjectValidator,
};
