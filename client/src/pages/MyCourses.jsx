import { useState, useEffect } from 'react';
import API from '../services/api';
import Alert from '../components/Alert';

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [meRes, coursesRes] = await Promise.all([
        API.get('/auth/me'),
        API.get('/courses'),
      ]);
      setEnrolledCourses(meRes.data.enrolledCourses || []);
      setAllCourses(coursesRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      const res = await API.post(`/students/enroll/${courseId}`);
      setMessage(res.data.message);
      setEnrolledCourses(res.data.enrolledCourses);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
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

  const enrolledIds = enrolledCourses.map((ec) => ec.course?._id);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" role="status"></div>
        <span className="loading-text">Loading courses...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="page-title">My Courses</h2>
      </div>
      {message && <Alert message={message} type="success" />}

      <div className="card mb-5">
        <div className="card-body">
          <h4 className="mb-3" style={{ fontWeight: 700, color: 'var(--dark)' }}>Enrolled Courses</h4>
          {enrolledCourses.length === 0 ? (
            <div className="empty-state">
              <p>You haven't enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Enrolled On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledCourses.map((ec) => (
                    <tr key={ec._id}>
                      <td><span className="course-code-badge">{ec.course?.courseCode}</span></td>
                      <td>{ec.course?.name}</td>
                      <td>{ec.course?.description}</td>
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

      <h4 className="mb-3" style={{ fontWeight: 700, color: 'var(--dark)' }}>Available Courses</h4>
      <div className="row g-4">
        {allCourses
          .filter((c) => !enrolledIds.includes(c._id))
          .map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <div className="card course-card h-100">
                <div className="card-body d-flex flex-column">
                  <span className="course-code-badge">{course.courseCode}</span>
                  <h5 className="course-title">{course.name}</h5>
                  <p className="course-desc">{course.description}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        {allCourses.filter((c) => !enrolledIds.includes(c._id)).length === 0 && (
          <div className="empty-state">
            <p>You're enrolled in all available courses!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
