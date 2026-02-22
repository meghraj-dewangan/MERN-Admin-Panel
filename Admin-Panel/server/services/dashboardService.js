import User from '../models/User.js';
import ProjectRequest from '../models/ProjectRequest.js';
import { ROLES } from '../config/permissions.js';

/**
 * SuperAdmin Dashboard:
 * - All managers with their project counts categorized by status
 */
const getSuperAdminDashboard = async () => {
  // Get all managers
  const managers = await User.find({ role: ROLES.MANAGER });

  const managerData = await Promise.all(
    managers.map(async (manager) => {
      const projects = await ProjectRequest.find({ createdBy: manager._id });
      const pending = projects.filter((p) => p.status === 'pending').length;
      const approved = projects.filter((p) => p.status === 'approved').length;
      const rejected = projects.filter((p) => p.status === 'rejected').length;

      return {
        manager: {
          _id: manager._id,
          name: manager.name,
          email: manager.email,
        },
        totalProjects: projects.length,
        pending,
        approved,
        rejected,
      };
    })
  );

  // Overall stats
  const totalUsers = await User.countDocuments();
  const totalProjects = await ProjectRequest.countDocuments();
  const totalPending = await ProjectRequest.countDocuments({ status: 'pending' });
  const totalApproved = await ProjectRequest.countDocuments({ status: 'approved' });
  const totalRejected = await ProjectRequest.countDocuments({ status: 'rejected' });

  return {
    stats: {
      totalUsers,
      totalProjects,
      totalPending,
      totalApproved,
      totalRejected,
    },
    managers: managerData,
  };
};

/**
 * Manager Dashboard:
 */
const getManagerDashboard = async (userId) => {
  const projects = await ProjectRequest.find({ createdBy: userId })
    .populate('assignedTo', 'name email');
  
  const pending = projects.filter((p) => p.status === 'pending');
  const approved = projects.filter((p) => p.status === 'approved');
  const rejected = projects.filter((p) => p.status === 'rejected');

  return {
    stats: {
      totalProjects: projects.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
    },
    projects: { pending, approved, rejected },
  };
};

/**
 * Staff Dashboard:
 * 
 */
const getStaffDashboard = async (userId) => {
  const projects = await ProjectRequest.find({ assignedTo: userId })
    .populate('createdBy', 'name email');
  
  const pending = projects.filter((p) => p.status === 'pending');
  const approved = projects.filter((p) => p.status === 'approved');
  const rejected = projects.filter((p) => p.status === 'rejected');

  return {
    stats: {
      totalProjects: projects.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
    },
    projects: { pending, approved, rejected },
  };
};

export { getSuperAdminDashboard, getManagerDashboard, getStaffDashboard };
