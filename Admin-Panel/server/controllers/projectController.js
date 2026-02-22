import * as projectService from '../services/projectService.js';
import * as ApiResponse from '../utils/apiResponse.js';
import { ROLES } from '../config/permissions.js';

/**
 * 
 *    Create a project request
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, assignedTo } = req.body;
    const project = await projectService.createProject({
      title,
      description,
      createdBy: req.user._id,
      assignedTo,
    });
    return ApiResponse.created(res, { project }, 'Project request created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *   Get projects based on user role
 */
const getProjects = async (req, res, next) => {
  try {
    let projects;
    const role = req.user.role;

    if (role === ROLES.SUPER_ADMIN) {
      projects = await projectService.getAllProjects();
    } else if (role === ROLES.MANAGER) {
      projects = await projectService.getProjectsByCreator(req.user._id);
    } else if (role === ROLES.STAFF) {
      projects = await projectService.getProjectsByAssignee(req.user._id);
    }

    return ApiResponse.success(res, { projects }, 'Projects fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *    Get single project
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);

    const role = req.user.role;
    if (
      role === ROLES.MANAGER &&
      project.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return ApiResponse.forbidden(res, 'You can only view your own projects');
    }
    if (
      role === ROLES.STAFF &&
      project.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return ApiResponse.forbidden(res, 'You can only view projects assigned to you');
    }

    return ApiResponse.success(res, { project }, 'Project fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 *
 *   Update project status
 */
const updateProjectStatus = async (req, res, next) => {
  try {
    const project = await projectService.updateProjectStatus(
      req.params.id,
      req.body.status,
      req.user._id,
      req.user.role
    );
    return ApiResponse.success(res, { project }, 'Project status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 *   Assign project to a staff member
 */
const assignProject = async (req, res, next) => {
  try {
    const project = await projectService.assignProject(
      req.params.id,
      req.body.assignedTo,
      req.user._id,
      req.user.role
    );
    return ApiResponse.success(res, { project }, 'Project assigned successfully');
  } catch (error) {
    next(error);
  }
};

export { createProject, getProjects, getProjectById, updateProjectStatus, assignProject };
