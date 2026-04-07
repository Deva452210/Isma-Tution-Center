const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, rollNumber, phone, address, grade, dob, password } = req.body;

    // Check for existing user
    let user = await User.findOne({ rollNumber });
    if (user) {
      return res.status(400).json({ message: 'User with this roll number already exists' });
    }

    // Create user object
    user = new User({
      name,
      rollNumber,
      phone,
      address,
      grade,
      dob,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        rollNumber: user.rollNumber,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, message: 'User created successfully' });
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // Hardcode Admin check
    if (rollNumber === '1234' && password === 'Ismail1234') {
      const payload = { user: { id: 'admin', rollNumber: '1234', name: 'Admin' } };
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, name: 'Admin', rollNumber: '1234', message: 'Admin Login successful' });
      });
    }

    // Check for user
    const user = await User.findOne({ rollNumber });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        rollNumber: user.rollNumber,
        name: user.name,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, name: user.name, message: 'Login successful' });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
