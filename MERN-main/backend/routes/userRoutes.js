const express = require('express');
const router = express.Router();
const User = require('../models/User');




// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, password, items, bankAccount = 1000, isAdmin = false, nation_id, nation, roles } = req.body;

    let nationObj = null;

    // Check if nation_id is provided, and find the nation based on ID
    if (nation_id) {
      nationObj = await Nation.findById(nation_id);
      if (!nationObj) {
        return res.status(404).json({ error: 'Nation not found' });
      }
    }

    // If nation name is provided, but no nation_id, find the nation based on the name
    if (!nation_id && nation) {
      nationObj = await Nation.findOne({ name: nation });
      if (!nationObj) {
        return res.status(404).json({ error: 'Nation not found' });
      }
    }

    // Create the user and set the nation fields accordingly
    const newUser = new User({
      username,
      password,
      items,
      bankAccount,
      isAdmin,
      nation: nationObj ? nationObj.name : null, // Set the nation name
      nation_id: nationObj ? nationObj._id : null, // Set the nation ID
      roles,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});




// Get User Details
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

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('nation');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
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
// Update User
router.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).populate('nation');
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    notifyClients({ type: 'USER_UPDATED', user: updatedUser });
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
