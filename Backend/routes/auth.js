const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Replace with your own secret key
const JWT_SECRET = 'aaronsecret123';

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
