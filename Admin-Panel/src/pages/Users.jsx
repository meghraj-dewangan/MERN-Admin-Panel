import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';

const ROLES = ['SuperAdmin', 'Manager', 'Staff'];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Create form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');
  const [creating, setCreating] = useState(false);

  // Role change
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data.data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post('/users', { name, email, password, role });
      toast.success('User created successfully');
      setShowCreate(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('Staff');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await API.put(`/users/${userId}/toggle-active`);
      toast.success('User status updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    try {
      await API.put(`/users/${selectedUser._id}/role`, { role: newRole });
      toast.success('Role updated successfully');
      setShowRole(false);
      setSelectedUser(null);
      setNewRole('');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Users Management</h4>
          <p className="text-muted mb-0">Manage all system users</p>
        </div>
        <button className="btn btn-dark" onClick={() => setShowCreate(true)}>
          + Create User
        </button>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-medium">{u.name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td className="text-center">
                      <span className="badge bg-dark">{u.role}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge bg-${u.isActive ? 'success' : 'secondary'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role);
                            setShowRole(true);
                          }}
                        >
                          Change Role
                        </button>
                        <button
                          className={`btn btn-sm ${
                            u.isActive ? 'btn-outline-danger' : 'btn-outline-success'
                          }`}
                          onClick={() => handleToggleActive(u._id)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Create User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Role</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button variant="dark" type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create User'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Change Role Modal */}
      <Modal show={showRole} onHide={() => setShowRole(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Change Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            Change role for <strong>{selectedUser?.name}</strong>:
          </p>
          <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowRole(false)}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleRoleChange}>
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
