import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [staffList, setStaffList] = useState([]);

  // Create form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'SuperAdmin' || user?.role === 'Manager') {
      fetchStaff();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data.data.projects);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await API.get('/users/role/Staff');
      setStaffList(res.data.data.users);
    } catch {
      toast.error('Failed to load Staff');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { title, description };
      if (assignTo) payload.assignedTo = assignTo;
      await API.post('/projects', payload);
      toast.success('Project created successfully');
      setShowCreate(false);
      setTitle('');
      setDescription('');
      setAssignTo('');
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      await API.put(`/projects/${projectId}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssign = async () => {
    if (!selectedProject || !assignTo) return;
    try {
      await API.put(`/projects/${selectedProject._id}/assign`, { assignedTo: assignTo });
      toast.success('Project assigned successfully');
      setShowAssign(false);
      setAssignTo('');
      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign project');
    }
  };

  const canCreate = user?.role === 'SuperAdmin' || user?.role === 'Manager';
  const canAssign = user?.role === 'SuperAdmin' || user?.role === 'Manager';
  const canUpdateStatus = user?.role === 'SuperAdmin' || user?.role === 'Staff';

  const [activeFilter, setActiveFilter] = useState('all');

  const getStatusBadge = (status) => {
    const map = { pending: 'warning', approved: 'success', rejected: 'danger' };
    return map[status] || 'secondary';
  };

  const filteredProjects =
    activeFilter === 'all' ? projects : projects.filter((p) => p.status === activeFilter);

  const filterCounts = {
    all: projects.length,
    pending: projects.filter((p) => p.status === 'pending').length,
    approved: projects.filter((p) => p.status === 'approved').length,
    rejected: projects.filter((p) => p.status === 'rejected').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Projects</h4>
          <p className="text-muted mb-0">
            {user?.role === 'SuperAdmin'
              ? 'All project requests'
              : user?.role === 'Manager'
              ? 'Your created projects'
              : 'Your assigned tasks'}
          </p>
        </div>
        {canCreate && (
          <button className="btn btn-dark" onClick={() => setShowCreate(true)}>
            + New Project
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`btn btn-sm ${
              activeFilter === f ? 'btn-dark' : 'btn-outline-secondary'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span
              className={`badge ms-1 ${
                activeFilter === f ? 'bg-light text-dark' : 'bg-secondary'
              }`}
            >
              {filterCounts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Projects Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created By</th>
                  <th>Assigned To</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p._id}>
                    <td className="fw-medium">{p.title}</td>
                    <td>
                      <small className="text-muted">{p.description?.substring(0, 60)}...</small>
                    </td>
                    <td>{p.createdBy?.name || '—'}</td>
                    <td>{p.assignedTo?.name || <span className="text-muted">Unassigned</span>}</td>
                    <td className="text-center">
                      <span className={`badge bg-${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center flex-wrap">
                        {canUpdateStatus  && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleStatusUpdate(p._id, 'approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleStatusUpdate(p._id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {canAssign && (
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => {
                              setSelectedProject(p);
                              setAssignTo(p.assignedTo?._id || '');
                              setShowAssign(true);
                            }}
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No {activeFilter === 'all' ? '' : activeFilter} projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Create Project Request</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Assign To (Optional)</Form.Label>
              <Form.Select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                <option value="">— Select Staff —</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.email})
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
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Assign Project Modal */}
      <Modal show={showAssign} onHide={() => setShowAssign(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Assign Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            Assign &quot;{selectedProject?.title}&quot; to a staff member:
          </p>
          <Form.Select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">— Select Staff —</option>
            {staffList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowAssign(false)}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleAssign} disabled={!assignTo}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Projects;
