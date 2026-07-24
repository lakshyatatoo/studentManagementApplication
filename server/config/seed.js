const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');

const courses = [
  { courseCode: 'CS101', name: 'Introduction to Computer Science', description: 'Fundamentals of computer science and programming.' },
  { courseCode: 'CS201', name: 'Data Structures and Algorithms', description: 'Study of data structures and algorithm design.' },
  { courseCode: 'CS301', name: 'Database Systems', description: 'Relational databases, SQL, and database design.' },
  { courseCode: 'CS202', name: 'Web Development', description: 'Modern web technologies and frameworks.' },
  { courseCode: 'CS401', name: 'Software Engineering', description: 'Software development lifecycle and methodologies.' },
];

const seedDB = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@studentapp.com' });
    if (!existingAdmin) {
      await User.create({
        fullName: 'Administrator',
        email: 'admin@studentapp.com',
        password: 'Admin@123',
        role: 'Admin',
        registeredOn: new Date(),
      });
      console.log('Admin user seeded: admin@studentapp.com / Admin@123');
    } else {
      console.log('Admin user already exists. Skipping.');
    }

    const existingCourses = await Course.countDocuments();
    if (existingCourses === 0) {
      await Course.insertMany(courses);
      console.log(`${courses.length} courses seeded successfully.`);
    } else {
      console.log(`${existingCourses} courses already exist. Skipping.`);
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

module.exports = seedDB;

if (require.main === module) {
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.join(__dirname, '..', '.env') });

  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('MongoDB connected for seeding...');
    await seedDB();
    process.exit(0);
  }).catch((err) => {
    console.error('Seeding error:', err.message);
    process.exit(1);
  });
}
