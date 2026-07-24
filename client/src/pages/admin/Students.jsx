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
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Manage Students</h2>
      {message && <Alert message={message} type="success" />}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Registered On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.address || '-'}</td>
              <td>{new Date(student.registeredOn).toLocaleDateString()}</td>
              <td>
                <Link to={`/admin/students/${student._id}`} className="btn btn-info btn-sm me-2">
                  Details
                </Link>
                <Link to={`/admin/students/${student._id}/edit`} className="btn btn-warning btn-sm me-2">
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
