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
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Course Catalog</h2>
      {message && <Alert message={message} type="success" />}
      <div className="row">
        {courses.map((course) => (
          <div key={course._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{course.courseCode}</h6>
                <p className="card-text flex-grow-1">{course.description}</p>
                {user && user.role === 'Student' && (
                  <button
                    className={`btn ${enrolledIds.includes(course._id) ? 'btn-success' : 'btn-primary'}`}
                    disabled={enrolledIds.includes(course._id)}
                    onClick={() => handleEnroll(course._id)}
                  >
                    {enrolledIds.includes(course._id) ? 'Enrolled' : 'Enroll'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="text-muted">No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
