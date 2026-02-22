import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import protect from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validate.js';
import { registerValidator, loginValidator } from '../utils/validators.js';
import { googleLogin } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/google-login', googleLogin);

// Protected routes
router.get('/me', protect, getMe);

export default router;
