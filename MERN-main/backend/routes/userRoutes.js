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
// PATCH User by ID (update specific fields)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Fields to update (e.g., roles, bankAccount, items)

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE User by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
