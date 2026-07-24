import { useState, useEffect } from 'react';
import API from '../../services/api';
import Alert from '../../components/Alert';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ courseCode: '', name: '', description: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ courseCode: '', name: '', description: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (course) => {
    setFormData({
      courseCode: course.courseCode,
      name: course.name,
      description: course.description || '',
    });
    setEditId(course._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/courses/${editId}`, formData);
        setMessage('Course updated successfully');
      } else {
        await API.post('/courses', formData);
        setMessage('Course created successfully');
      }
      resetForm();
      fetchCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await API.delete(`/courses/${id}`);
      setMessage('Course deleted successfully');
      setCourses(courses.filter((c) => c._id !== id));
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Courses</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      {message && <Alert message={message} type="success" />}

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>{editId ? 'Edit Course' : 'Add New Course'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Course Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success me-2">
                {editId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.courseCode}</td>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCourses;
