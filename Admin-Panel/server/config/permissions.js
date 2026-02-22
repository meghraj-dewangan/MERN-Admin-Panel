/**
* 
 * This defines all permissions based on role.
 *  
 * To add a new role, add a new entry in ROLE_PERMISSIONS.
 
 */

const PERMISSIONS = {
  // User management
  CREATE_USER: 'create_user',
  VIEW_ALL_USERS: 'view_all_users',
  CHANGE_USER_ROLE: 'change_user_role',
  TOGGLE_USER_ACTIVE: 'toggle_user_active',

  // Project requests
  CREATE_PROJECT: 'create_project',
  VIEW_ALL_PROJECTS: 'view_all_projects',
  VIEW_OWN_PROJECTS: 'view_own_projects',
  VIEW_ASSIGNED_PROJECTS: 'view_assigned_projects',
  ASSIGN_PROJECT: 'assign_project',
  UPDATE_PROJECT_STATUS: 'update_project_status',

  // Dashboard
  VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
  VIEW_MANAGER_DASHBOARD: 'view_manager_dashboard',
  VIEW_STAFF_DASHBOARD: 'view_staff_dashboard',
};

const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.CHANGE_USER_ROLE,
    PERMISSIONS.TOGGLE_USER_ACTIVE,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.VIEW_OWN_PROJECTS,
    PERMISSIONS.VIEW_ASSIGNED_PROJECTS,
    PERMISSIONS.ASSIGN_PROJECT,
    PERMISSIONS.UPDATE_PROJECT_STATUS,
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    PERMISSIONS.VIEW_MANAGER_DASHBOARD,
    PERMISSIONS.VIEW_STAFF_DASHBOARD,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.VIEW_OWN_PROJECTS,
    PERMISSIONS.ASSIGN_PROJECT,
    PERMISSIONS.VIEW_MANAGER_DASHBOARD,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_ASSIGNED_PROJECTS,
    PERMISSIONS.UPDATE_PROJECT_STATUS,
    PERMISSIONS.VIEW_STAFF_DASHBOARD,
  ],
};

/**
 * Get permissions for a given role
 */
const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};


const hasPermission = (role, permission) => {
  const perms = getPermissionsForRole(role);
  return perms.includes(permission);
};

export { PERMISSIONS, ROLES, ROLE_PERMISSIONS, getPermissionsForRole, hasPermission };
