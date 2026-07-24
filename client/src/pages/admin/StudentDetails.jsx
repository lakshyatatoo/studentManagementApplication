import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import Alert from '../../components/Alert';

const StudentDetails = () => {
  const { id } = useParams();
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
      <div className="loading-container">
        <div className="spinner-border" role="status"></div>
        <span className="loading-text">Loading student...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <Alert message={message || 'Student not found'} type="danger" />
        <Link to="/admin/students" className="btn btn-primary mt-3">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="page-title">Student Details</h2>
      </div>
      {message && <Alert message={message} type="success" />}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '1.5rem', fontWeight: 700,
                    marginBottom: '0.75rem',
                  }}
                >
                  {student.fullName?.charAt(0) || 'S'}
                </div>
                <h5 style={{ fontWeight: 700 }}>{student.fullName}</h5>
                <span className="badge bg-primary">{student.role}</span>
              </div>
              <table className="table mb-0" style={{ boxShadow: 'none' }}>
                <tbody>
                  <tr><td style={{ fontWeight: 600, width: '40%' }}>Email</td><td>{student.email}</td></tr>
                  <tr><td style={{ fontWeight: 600 }}>Address</td><td>{student.address || <span style={{ color: 'var(--gray-400)' }}>—</span>}</td></tr>
                  <tr><td style={{ fontWeight: 600 }}>Registered</td><td>{new Date(student.registeredOn).toLocaleDateString()}</td></tr>
                </tbody>
              </table>
              <Link to={`/admin/students/${student._id}/edit`} className="btn btn-warning w-100 mt-3">
                Edit Student
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4" style={{ fontWeight: 700, color: 'var(--dark)' }}>Enrolled Courses</h4>
              {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                <div className="table-responsive">
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
                          <td><span className="course-code-badge">{ec.course?.courseCode}</span></td>
                          <td>{ec.course?.name}</td>
                          <td>{ec.course?.description}</td>
                          <td>{new Date(ec.registeredOn).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No courses enrolled.</p>
                </div>
              )}
              <Link to="/admin/students" className="btn btn-secondary mt-3">
                ← Back to Students
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
