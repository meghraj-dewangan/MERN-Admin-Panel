import * as authService from '../services/authService.js';
import * as ApiResponse from '../utils/apiResponse.js';
import { googleLoginService } from '../services/authService.js';


const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const data = await authService.register({ name, email, password, role });
    return ApiResponse.created(res, data, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    return ApiResponse.success(res, data, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const data = await authService.googleLoginService(idToken);
    return ApiResponse.success(res, data, 'Google login successful');
  } catch (error) {
    next(error);
  }
};


const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    return ApiResponse.success(res, { user }, 'User profile fetched');
  } catch (error) {
    next(error);
  }
};

export { register, login, getMe,googleLogin };
