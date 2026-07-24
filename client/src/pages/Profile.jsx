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
      <div className="loading-container">
        <div className="spinner-border" role="status"></div>
        <span className="loading-text">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {message && <div className="col-12"><Alert message={message} type="success" /></div>}

      <div className="col-lg-5">
        <div className="card">
          <div className="card-body">
            <h3 className="page-title mb-4" style={{ fontSize: '1.3rem' }}>My Profile</h3>
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
              <button type="submit" className="btn btn-primary w-100">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card">
          <div className="card-body">
            <h3 className="page-title mb-4" style={{ fontSize: '1.3rem' }}>My Enrolled Courses</h3>
            {enrolledCourses.length === 0 ? (
              <div className="empty-state">
                <p>No courses enrolled yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
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
                        <td><span className="course-code-badge">{ec.course?.courseCode}</span></td>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
