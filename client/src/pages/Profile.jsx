import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ fullName: '', address: '' });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/auth/me');
      setFormData({ fullName: res.data.fullName || '', address: res.data.address || '' });
      setEnrolledCourses(res.data.enrolledCourses || []);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/students/profile', formData);
      updateUser(res.data);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDrop = async (courseId) => {
    try {
      const res = await API.delete(`/students/drop/${courseId}`);
      setMessage(res.data.message);
      setEnrolledCourses(res.data.enrolledCourses);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to drop course');
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
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h3>My Profile</h3>
            {message && <Alert message={message} type="success" />}
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={user?.email || ''} disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <input type="text" className="form-control" value={user?.role || ''} disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h3>My Enrolled Courses</h3>
            {enrolledCourses.length === 0 ? (
              <p className="text-muted">No courses enrolled yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Enrolled On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledCourses.map((ec) => (
                    <tr key={ec._id}>
                      <td>{ec.course?.courseCode}</td>
                      <td>{ec.course?.name}</td>
                      <td>{new Date(ec.registeredOn).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDrop(ec.course?._id)}
                        >
                          Drop
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
