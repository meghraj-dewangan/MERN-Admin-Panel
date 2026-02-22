import ProjectRequest from '../models/ProjectRequest.js';

/**
 * Create a new project request
 */
const createProject = async ({ title, description, createdBy, assignedTo }) => {
  const project = await ProjectRequest.create({
    title,
    description,
    createdBy,
    assignedTo: assignedTo || null,
  });
  return project.populate(['createdBy', 'assignedTo']);
};

/**
 * Get all projects (SuperAdmin)
 */
const getAllProjects = async () => {
  return ProjectRequest.find()
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 });
};

/**
 * Get projects created by a specific user (Manager)
 */
const getProjectsByCreator = async (userId) => {
  return ProjectRequest.find({ createdBy: userId })
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 });
};

/**
 * Get projects assigned to a specific user (Staff)
 */
const getProjectsByAssignee = async (userId) => {
  return ProjectRequest.find({ assignedTo: userId })
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 });
};

/**
 * Get a single project by ID
 */
const getProjectById = async (projectId) => {
  const project = await ProjectRequest.findById(projectId)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

/**
 * Update project status (Staff updates status)
 */
const updateProjectStatus = async (projectId, status, userId, userRole) => {
  const project = await ProjectRequest.findById(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  // Staff can only update projects assigned to them
  if (userRole === 'Staff' && project.assignedTo?.toString() !== userId.toString()) {
    const error = new Error('You can only update projects assigned to you');
    error.statusCode = 403;
    throw error;
  }

  project.status = status;
  await project.save();
  return project.populate(['createdBy', 'assignedTo']);
};

/**
 * Assign a project to a staff member (Manager)
 */
const assignProject = async (projectId, assignedTo, userId, userRole) => {
  const project = await ProjectRequest.findById(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  // Managers can only assign their own projects
  if (userRole === 'Manager' && project.createdBy.toString() !== userId.toString()) {
    const error = new Error('You can only assign projects you created');
    error.statusCode = 403;
    throw error;
  }

  project.assignedTo = assignedTo;
  await project.save();
  return project.populate(['createdBy', 'assignedTo']);
};

export { createProject, getAllProjects, getProjectsByCreator, getProjectsByAssignee, getProjectById, updateProjectStatus, assignProject };
