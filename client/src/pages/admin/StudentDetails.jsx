import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import Alert from '../../components/Alert';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await API.get(`/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      setMessage('Student not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <Alert message={message || 'Student not found'} type="danger" />
        <Link to="/admin/students" className="btn btn-primary">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Student Details</h2>
      {message && <Alert message={message} type="success" />}
      <div className="card">
        <div className="card-body">
          <p><strong>Full Name:</strong> {student.fullName}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Address:</strong> {student.address || '-'}</p>
          <p><strong>Role:</strong> {student.role}</p>
          <p><strong>Registered On:</strong> {new Date(student.registeredOn).toLocaleDateString()}</p>

          <h5 className="mt-4">Enrolled Courses</h5>
          {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Enrolled On</th>
                </tr>
              </thead>
              <tbody>
                {student.enrolledCourses.map((ec) => (
                  <tr key={ec._id}>
                    <td>{ec.course?.courseCode}</td>
                    <td>{ec.course?.name}</td>
                    <td>{ec.course?.description}</td>
                    <td>{new Date(ec.registeredOn).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted">No courses enrolled.</p>
          )}

          <Link to="/admin/students" className="btn btn-secondary mt-3">
            Back to Students
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
