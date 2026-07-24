import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Alert from '../../components/Alert';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await API.delete(`/students/${id}`);
      setMessage('Student deleted successfully');
      setStudents(students.filter((s) => s._id !== id));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" role="status"></div>
        <span className="loading-text">Loading students...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="page-title">Manage Students</h2>
      </div>
      {message && <Alert message={message} type="success" />}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td><strong>{student.fullName}</strong></td>
                    <td>{student.email}</td>
                    <td>{student.address || <span style={{ color: 'var(--gray-400)' }}>—</span>}</td>
                    <td>{new Date(student.registeredOn).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btn-group">
                        <Link to={`/admin/students/${student._id}`} className="btn btn-info btn-sm">
                          Details
                        </Link>
                        <Link to={`/admin/students/${student._id}/edit`} className="btn btn-warning btn-sm">
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
