import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
        <h1>Welcome to StudHub</h1>
        <p className="lead">
          Manage courses, enroll students, and track academic progress — all in one place.
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
            <p className="mb-3" style={{ color: 'var(--gray-500)' }}>
              Logged in as <strong>{user.fullName || user.email}</strong>
              <span className="badge bg-primary ms-2">{user.role}</span>
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
    </div>
  );
};

export default Home;
