import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import Students from './pages/admin/Students';
import StudentDetails from './pages/admin/StudentDetails';
import EditStudent from './pages/admin/EditStudent';
import AdminCourses from './pages/admin/AdminCourses';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 d-flex flex-column">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute role="Student">
                    <div className="container py-4"><Profile /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute role="Student">
                    <div className="container py-4"><MyCourses /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute role="Admin">
                    <div className="container py-4"><Students /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/students/:id"
                element={
                  <ProtectedRoute role="Admin">
                    <div className="container py-4"><StudentDetails /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/students/:id/edit"
                element={
                  <ProtectedRoute role="Admin">
                    <div className="container py-4"><EditStudent /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute role="Admin">
                    <div className="container py-4"><AdminCourses /></div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
