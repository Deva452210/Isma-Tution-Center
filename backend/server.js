const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const materialsRoutes = require('./routes/materials');
const usersRoutes = require('./routes/users');

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/users', usersRoutes);

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection successful');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
