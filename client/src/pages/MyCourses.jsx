import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
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
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">My Courses</h2>
      {message && <Alert message={message} type="success" />}

      <h4 className="mb-3">Enrolled Courses</h4>
      {enrolledCourses.length === 0 ? (
        <p className="text-muted mb-4">You haven't enrolled in any courses yet.</p>
      ) : (
        <table className="table table-striped mb-5">
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
                <td>{ec.course?.courseCode}</td>
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
      )}

      <h4 className="mb-3">Available Courses</h4>
      <div className="row">
        {allCourses
          .filter((c) => !enrolledIds.includes(c._id))
          .map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{course.courseCode}</h6>
                  <p className="card-text flex-grow-1">{course.description}</p>
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
      </div>
    </div>
  );
};

export default MyCourses;
