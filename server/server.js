const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDB = require('./config/seed');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/students', require('./routes/students'));

app.get('/api', (req, res) => {
  res.json({ message: 'Student Management API', endpoints: ['/api/auth', '/api/courses', '/api/students'] });
});

app.get('/', (req, res) => {
  res.json({ message: 'Student Management API is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await seedDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
