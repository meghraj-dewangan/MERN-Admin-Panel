import * as dashboardService from '../services/dashboardService.js';
import * as ApiResponse from '../utils/apiResponse.js';
import { ROLES } from '../config/permissions.js';


const getDashboard = async (req, res, next) => {
  try {
    let data;
    const role = req.user.role;

    if (role === ROLES.SUPER_ADMIN) {
      
      data = await dashboardService.getSuperAdminDashboard();
    } else if (role === ROLES.MANAGER) {
      data = await dashboardService.getManagerDashboard(req.user._id);
    } else if (role === ROLES.STAFF) {
      data = await dashboardService.getStaffDashboard(req.user._id);
    }

    return ApiResponse.success(res, { dashboard: data, role }, 'Dashboard data fetched');
  } catch (error) {
    next(error);
  }
};

export { getDashboard };
