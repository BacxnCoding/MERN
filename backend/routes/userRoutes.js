const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('nation');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Fetch a user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('nation');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    // Notify clients via WebSocket
    req.wss.clients.forEach((client) => {
      if (client.readyState === 1) {  // WebSocket.OPEN is 1
        client.send(JSON.stringify({ type: 'user-create', user: savedUser }));
      }
    });

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user by ID (using PATCH for partial updates)
router.patch('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Notify clients about role change via WebSocket
    req.wss.clients.forEach((client) => {
      if (client.readyState === 1) {  // WebSocket.OPEN is 1
        client.send(JSON.stringify({ type: 'user-role-update', user: updatedUser }));
      }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user roles' });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Notify clients via WebSocket
    req.wss.clients.forEach((client) => {
      if (client.readyState === 1) {  // WebSocket.OPEN is 1
        client.send(JSON.stringify({ type: 'user-delete', userId: deletedUser._id }));
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
