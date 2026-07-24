import { useState, useEffect } from 'react';
import API from '../services/api';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setCourses(res.data);

      if (user && user.role === 'Student') {
        const meRes = await API.get('/auth/me');
        setEnrolledIds(meRes.data.enrolledCourses.map((ec) => ec.course._id));
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await API.post(`/students/enroll/${courseId}`);
      setMessage(res.data.message);
      setEnrolledIds([...enrolledIds, courseId]);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" role="status"></div>
        <span className="loading-text">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="section-header">
        <h2 className="page-title">Course Catalog</h2>
      </div>
      {message && <Alert message={message} type="success" />}
      <div className="row g-4">
        {courses.map((course) => (
          <div key={course._id} className="col-md-6 col-lg-4">
            <div className="card course-card h-100">
              <div className="card-body d-flex flex-column">
                <span className="course-code-badge">{course.courseCode}</span>
                <h5 className="course-title">{course.name}</h5>
                <p className="course-desc">{course.description}</p>
                {user && user.role === 'Student' && (
                  <button
                    className={`btn ${enrolledIds.includes(course._id) ? 'btn-success' : 'btn-primary'}`}
                    disabled={enrolledIds.includes(course._id)}
                    onClick={() => handleEnroll(course._id)}
                  >
                    {enrolledIds.includes(course._id) ? '✓ Enrolled' : 'Enroll'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="empty-state">
            <p>No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
