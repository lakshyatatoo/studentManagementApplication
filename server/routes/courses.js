const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET /api/courses - Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseCode: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/courses - Admin only
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { courseCode, name, description } = req.body;

    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this code already exists' });
    }

    const course = await Course.create({ courseCode, name, description });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/courses/:id - Admin only
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { courseCode, name, description } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (courseCode) course.courseCode = courseCode;
    if (name) course.name = name;
    if (description !== undefined) course.description = description;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/courses/:id - Admin only
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
