# Student Registration Management System

A full MERN stack application for managing student course registrations with role-based authentication.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router v6, Bootstrap 5.3 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT, bcryptjs |

## Features

### Public
- Browse course catalog
- Register new account (auto-assigned Student role)
- Login/Logout

### Admin (`admin@studentapp.com` / `Admin@123`)
- View all students
- View student details (including enrolled courses)
- Edit / Delete students
- Full course CRUD (Create, Read, Update, Delete)

### Student
- View and edit profile
- Browse available courses
- Enroll in / Drop courses
- View enrolled courses with registration dates

## Project Structure

```
├── server/                 # Express API backend
│   ├── server.js           # Entry point
│   ├── config/             # DB connection + seed script
│   ├── middleware/          # JWT auth middleware
│   ├── models/             # Mongoose schemas (User, Course)
│   └── routes/             # API routes (auth, courses, students)
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── context/        # AuthContext (JWT state management)
│   │   ├── components/     # Navbar, Alert, ProtectedRoute
│   │   ├── pages/          # Home, Login, Register, Profile, etc.
│   │   └── services/       # Axios API client
│   └── vite.config.js      # Dev proxy config
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register student |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Any | Get current user profile |
| GET | `/api/courses` | Public | List all courses |
| GET | `/api/courses/:id` | Public | Get course details |
| POST | `/api/courses` | Admin | Create course |
| PUT | `/api/courses/:id` | Admin | Update course |
| DELETE | `/api/courses/:id` | Admin | Delete course |
| GET | `/api/students` | Admin | List all students |
| GET | `/api/students/:id` | Admin | Get student details |
| PUT | `/api/students/:id` | Admin | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |
| PUT | `/api/students/profile` | Student | Update own profile |
| POST | `/api/students/enroll/:courseId` | Student | Enroll in course |
| DELETE | `/api/students/drop/:courseId` | Student | Drop course |
