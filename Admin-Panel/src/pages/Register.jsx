import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: '100vh' }}
    >
      <div className="card shadow-sm border-0" style={{ width: 420, maxWidth: '95%' }}>
        <div className="card-body p-5">
          <h3 className="text-center fw-bold mb-1">Create Account</h3>
          <p className="text-center text-muted mb-4">Register a new account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            <small className="text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-dark fw-medium">
                Sign In
              </Link>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
