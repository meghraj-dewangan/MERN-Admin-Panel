import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BsSpeedometer2,
  BsFolder2Open,
  BsPeopleFill,
  BsBoxArrowRight,
} from 'react-icons/bs';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <BsSpeedometer2 /> },
    { to: '/projects', label: 'Projects', icon: <BsFolder2Open /> },
  ];

  // Only SuperAdmin can see Users page
  if (user?.role === 'SuperAdmin') {
    navItems.push({ to: '/users', label: 'Users', icon: <BsPeopleFill /> });
  }

  return (
    <div
      className="d-flex flex-column bg-white border-end shadow-sm"
      style={{ width: 250, minHeight: '100vh' }}
    >
      {/* Brand */}
      <div className="p-3 border-bottom">
        <h5 className="mb-0 fw-bold text-dark">
          Admin Panel
        </h5>
        <small className="text-muted">{user?.role}</small>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 p-3">
        <ul className="nav flex-column gap-1">
          {navItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 rounded px-3 py-2 ${
                    isActive
                      ? 'bg-dark text-white'
                      : 'text-dark'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-top">
        <div className="mb-2">
          <div className="fw-semibold text-dark">{user?.name}</div>
          <small className="text-muted">{user?.email}</small>
        </div>
        <button
          onClick={logout}
          className="btn btn-dark btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <BsBoxArrowRight />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
