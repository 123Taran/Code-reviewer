const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config()


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Replace with process.env.JWT_SECRET for production

// Register Route (already added)
router.post('/register', async (req, res) => {
  const { username, password, icon } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, icon });
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Registration failed', error: err.message });
  }
});

// Login Route (ADD THIS)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, icon: user.icon },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, username: user.username, icon: user.icon });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
});

module.exports = router;
