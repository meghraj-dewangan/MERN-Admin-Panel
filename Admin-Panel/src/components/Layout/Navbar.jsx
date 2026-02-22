import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-2">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-dark mb-0">
          Dashboard
        </span>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-dark">{user?.role}</span>
          <span className="text-dark fw-medium">{user?.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
