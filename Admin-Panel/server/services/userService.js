import User from '../models/User.js';

/**
 * Get all users
 */
const getAllUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

/**
 * Get single user by ID
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Create a new user (by SuperAdmin)
 */
const createUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ name, email, password, role });
  return user;
};

/**
 * Change user role
 */
const changeUserRole = async (userId, newRole) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.role = newRole;
  await user.save();
  return user;
};

/**
 * Toggle user active status
 */
const toggleUserActive = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.isActive = !user.isActive;
  await user.save();
  return user;
};

/**
 * Get users by role
 */
const getUsersByRole = async (role) => {
  return User.find({ role }).sort({ createdAt: -1 });
};

export { getAllUsers, getUserById, createUser, changeUserRole, toggleUserActive, getUsersByRole };
