import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Google Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed';
      toast.error(msg);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In Failed');
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: '100vh' }}
    >
      <div className="card shadow-sm border-0" style={{ width: 420, maxWidth: '95%' }}>
        <div className="card-body p-5">
          <h3 className="text-center fw-bold mb-1">Sign In</h3>
          <p className="text-center text-muted mb-4">
            Sign in to your account
          </p>

          {/* Email Login */}
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="text-center my-4">
            <small className="text-muted">OR</small>
          </div>

          {/* Google Login Button */}
          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <p className="text-center mt-3 mb-0">
            <small className="text-muted">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-dark fw-medium">
                Register
              </Link>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;