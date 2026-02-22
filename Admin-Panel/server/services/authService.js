import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

/**
 * Register a new user
 */
 const register = async ({ name, email, password, role }) => {
   // Check if user already exists
   const existingUser = await User.findOne({ email });
   if (existingUser) {
     const error = new Error('User with this email already exists');
     error.statusCode = 400;
     throw error;
   }

   const user = await User.create({ name, email, password, role });
   const token = generateToken(user._id);

   return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Login user
//  */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Contact admin.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }


  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
};


const googleLoginService = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub, email, name, email_verified } = payload;

  if (!email_verified) {
    const error = new Error('Google email not verified');
    error.statusCode = 400;
    throw error;
  }

  let user = await User.findOne({ email });

  // If user doesn't exist → create
  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: sub,
      password: Math.random().toString(36), // hashed automatically
    });
  }

  // If user exists but no googleId stored
  if (user && !user.googleId) {
    user.googleId = sub;
    await user.save();
  }

  if (!user.isActive) {
    const error = new Error('Account deactivated');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
};




/**
 * Get current user profile
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export { register, login, getMe,googleLoginService };
