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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 bg-light">
          <Navbar />
          <main className="container my-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute role="Student">
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute role="Student">
                    <MyCourses />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute role="Admin">
                    <Students />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/students/:id"
                element={
                  <ProtectedRoute role="Admin">
                    <StudentDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/students/:id/edit"
                element={
                  <ProtectedRoute role="Admin">
                    <EditStudent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute role="Admin">
                    <AdminCourses />
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
