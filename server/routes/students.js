const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, isAdmin, isStudent } = require('../middleware/authMiddleware');

// GET /api/students - Admin: list all students
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).select('-enrolledCourses').sort({ registeredOn: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/students/:id - Admin: get student details
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const student = await User.findById(req.params.id).populate('enrolledCourses.course');
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/students/:id - Admin: update student info
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { fullName, address } = req.body;
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (fullName !== undefined) student.fullName = fullName;
    if (address !== undefined) student.address = address;

    await student.save();
    res.json({
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      address: student.address,
      role: student.role,
      registeredOn: student.registeredOn,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/students/:id - Admin: delete student
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/students/profile - Student: update own profile
router.put('/profile', protect, isStudent, async (req, res) => {
  try {
    const { fullName, address } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName !== undefined) user.fullName = fullName;
    if (address !== undefined) user.address = address;

    await user.save();
    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      role: user.role,
      registeredOn: user.registeredOn,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/students/enroll/:courseId - Student: enroll in a course
router.post('/enroll/:courseId', protect, isStudent, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const alreadyEnrolled = user.enrolledCourses.some(
      (ec) => ec.course.toString() === req.params.courseId
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push({ course: course._id, registeredOn: new Date() });
    await user.save();

    const updatedUser = await User.findById(user._id).populate('enrolledCourses.course');
    res.json({
      message: `Successfully enrolled in '${course.name}'`,
      enrolledCourses: updatedUser.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/students/drop/:courseId - Student: drop a course
router.delete('/drop/:courseId', protect, isStudent, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const enrollmentIndex = user.enrolledCourses.findIndex(
      (ec) => ec.course.toString() === req.params.courseId
    );
    if (enrollmentIndex === -1) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    user.enrolledCourses.splice(enrollmentIndex, 1);
    await user.save();

    const updatedUser = await User.findById(user._id).populate('enrolledCourses.course');
    res.json({
      message: 'Course dropped successfully',
      enrolledCourses: updatedUser.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
