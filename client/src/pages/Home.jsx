import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="display-4 mb-4">Welcome to Student Registration System</h1>
      <p className="lead mb-4">
        Manage courses, enroll students, and track academic progress.
      </p>

      {!user ? (
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg">
            Login
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-3">
            Logged in as <strong>{user.fullName || user.email}</strong> ({user.role})
          </p>
          {user.role === 'Admin' ? (
            <Link to="/admin/students" className="btn btn-primary btn-lg">
              Manage Students
            </Link>
          ) : (
            <Link to="/courses" className="btn btn-primary btn-lg">
              Browse Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
