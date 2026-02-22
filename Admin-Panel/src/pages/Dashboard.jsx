import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import {
  BsFolderFill,
  BsClockFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsPeopleFill,
} from 'react-icons/bs';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
     
    try {
      const res = await API.get('/dashboard');
     
      setData(res.data.data.dashboard);
      setRole(res.data.data.role);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <p className="text-muted">No dashboard data available.</p>;

  return (
    <div>
      <h4 className="fw-bold mb-1">Dashboard</h4>
      <p className="text-muted mb-4">Welcome back, {user?.name}</p>

      {role === 'SuperAdmin' && <SuperAdminDashboard data={data} />}
      {role === 'Manager' && <ManagerDashboard data={data} />}
      {role === 'Staff' && <StaffDashboard data={data} />}
    </div>
  );
};

/* ========= SUPER ADMIN DASHBOARD ========= */
const SuperAdminDashboard = ({ data }) => {
  const { stats, managers } = data;
  const [selectedManager, setSelectedManager] = useState(null);
  const [managerProjects, setManagerProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [modalFilter, setModalFilter] = useState('all');

  const openManagerModal = async (manager) => {
    setSelectedManager(manager);
    setModalFilter('all');
    setLoadingProjects(true);
    try {
      const res = await API.get('/projects');
      const all = res.data.data.projects.filter(
        (p) => p.createdBy?._id === manager.manager._id || p.createdBy === manager.manager._id
      );
      setManagerProjects(all);
    } catch {
      toast.error('Failed to load manager projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const filteredModalProjects =
    modalFilter === 'all'
      ? managerProjects
      : managerProjects.filter((p) => p.status === modalFilter);

  const getStatusBadge = (status) => {
    const map = { pending: 'warning', approved: 'success', rejected: 'danger' };
    return map[status] || 'secondary';
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <StatCard icon={<BsPeopleFill />} label="Total Users" value={stats.totalUsers} color="#212529" />
        <StatCard icon={<BsFolderFill />} label="Total Projects" value={stats.totalProjects} color="#212529" />
        <StatCard icon={<BsClockFill />} label="Pending" value={stats.totalPending} color="#ffc107" />
        <StatCard icon={<BsCheckCircleFill />} label="Approved" value={stats.totalApproved} color="#198754" />
        <StatCard icon={<BsXCircleFill />} label="Rejected" value={stats.totalRejected} color="#dc3545" />
      </div>

      {/* Managers Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h6 className="mb-0 fw-bold">Managers & Their Projects</h6>
          <small className="text-muted">Click a row to view their projects</small>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Manager</th>
                  <th>Email</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Pending</th>
                  <th className="text-center">Approved</th>
                  <th className="text-center">Rejected</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((m) => (
                  <tr
                    key={m.manager._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => openManagerModal(m)}
                    title="Click to view projects"
                  >
                    <td className="fw-medium text-primary">
                      {m.manager.name}
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>View projects →</small>
                    </td>
                    <td className="text-muted">{m.manager.email}</td>
                    <td className="text-center">{m.totalProjects}</td>
                    <td className="text-center">
                      <span className="badge bg-warning text-dark">{m.pending}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success">{m.approved}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-danger">{m.rejected}</span>
                    </td>
                  </tr>
                ))}
                {managers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No managers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manager Projects Modal */}
      <Modal
        show={!!selectedManager}
        onHide={() => setSelectedManager(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0">
          <div>
            <Modal.Title className="fw-bold">
              {selectedManager?.manager?.name}&apos;s Projects
            </Modal.Title>
            <small className="text-muted">{selectedManager?.manager?.email}</small>
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* Filter Tabs */}
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setModalFilter(f)}
                className={`btn btn-sm ${
                  modalFilter === f ? 'btn-dark' : 'btn-outline-secondary'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'all' ? (
                  <span className="badge bg-secondary ms-1">{managerProjects.length}</span>
                ) : (
                  <span className="badge bg-secondary ms-1">
                    {managerProjects.filter((p) => p.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loadingProjects ? (
            <div className="text-center py-4">
              <span className="spinner-border spinner-border-sm" />
            </div>
          ) : filteredModalProjects.length === 0 ? (
            <p className="text-center text-muted py-4">No projects found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModalProjects.map((p) => (
                    <tr key={p._id}>
                      <td className="fw-medium">{p.title}</td>
                      <td>
                        <small className="text-muted">{p.description?.substring(0, 60)}...</small>
                      </td>
                      <td>{p.assignedTo?.name || <span className="text-muted">Unassigned</span>}</td>
                      <td className="text-center">
                        <span className={`badge bg-${getStatusBadge(p.status)}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button className="btn btn-dark" onClick={() => setSelectedManager(null)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/* ========= MANAGER DASHBOARD ========= */
const ManagerDashboard = ({ data }) => {
  const { stats, projects } = data;

  return (
    <>
      <div className="row g-3 mb-4">
        <StatCard icon={<BsFolderFill />} label="My Projects" value={stats.totalProjects} color="#212529" />
        <StatCard icon={<BsClockFill />} label="Pending" value={stats.pending} color="#ffc107" />
        <StatCard icon={<BsCheckCircleFill />} label="Approved" value={stats.approved} color="#198754" />
        <StatCard icon={<BsXCircleFill />} label="Rejected" value={stats.rejected} color="#dc3545" />
      </div>

      <div className="row g-3">
        <ProjectColumn title="Pending" projects={projects.pending} variant="warning" />
        <ProjectColumn title="Approved" projects={projects.approved} variant="success" />
        <ProjectColumn title="Rejected" projects={projects.rejected} variant="danger" />
      </div>
    </>
  );
};

/* ========= STAFF DASHBOARD ========= */
const StaffDashboard = ({ data }) => {
  const { stats, projects } = data;

  return (
    <>
      <div className="row g-3 mb-4">
        <StatCard icon={<BsFolderFill />} label="Assigned Tasks" value={stats.totalProjects} color="#212529" />
        <StatCard icon={<BsClockFill />} label="Pending" value={stats.pending} color="#ffc107" />
        <StatCard icon={<BsCheckCircleFill />} label="Approved" value={stats.approved} color="#198754" />
        <StatCard icon={<BsXCircleFill />} label="Rejected" value={stats.rejected} color="#dc3545" />
      </div>

      <div className="row g-3">
        <ProjectColumn title="Pending" projects={projects.pending} variant="warning" />
        <ProjectColumn title="Approved" projects={projects.approved} variant="success" />
        <ProjectColumn title="Rejected" projects={projects.rejected} variant="danger" />
      </div>
    </>
  );
};

/* ========= REUSABLE COMPONENTS ========= */

const StatCard = ({ icon, label, value, color }) => (
  <div className="col-6 col-md-4 col-lg">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{ width: 48, height: 48, backgroundColor: color, color: '#fff', fontSize: 20 }}
        >
          {icon}
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-bold fs-4">{value}</div>
        </div>
      </div>
    </div>
  </div>
);

const ProjectColumn = ({ title, projects, variant }) => (
  <div className="col-md-4">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold">{title}</h6>
        <span className={`badge bg-${variant}`}>{projects.length}</span>
      </div>
      <div className="card-body" style={{ maxHeight: 400, overflowY: 'auto' }}>
        {projects.length === 0 ? (
          <p className="text-muted text-center small">No projects</p>
        ) : (
          projects.map((p) => (
            <div key={p._id} className="border rounded p-3 mb-2">
              <div className="fw-medium">{p.title}</div>
              <small className="text-muted d-block mt-1">{p.description?.substring(0, 80)}...</small>
              {p.assignedTo && (
                <small className="text-muted d-block mt-1">
                  Assigned to: {p.assignedTo.name || p.assignedTo.email}
                </small>
              )}
              {p.createdBy && (
                <small className="text-muted d-block">
                  Created by: {p.createdBy.name || p.createdBy.email}
                </small>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;
