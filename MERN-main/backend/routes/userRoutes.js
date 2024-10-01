const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, password, items, bankAccount = 1000, isAdmin = false, nation, roles } = req.body;

    const newUser = new User({
      username,
      password,
      items,
      bankAccount,
      isAdmin,
      nation,
      roles
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

module.exports = router;
