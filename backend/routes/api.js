const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Nation = require('../models/Nation');
const PurchaseRequest = require('../models/PurchaseRequest');

// Login route with role and nation population
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user with the provided credentials and populate the associated nation
    const user = await User.findOne({ username, password }).populate('nation');
    if (user) {
      res.json(user); // Send back the full user object with the populated nation data
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Update nation stats
router.put('/nations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const nation = await Nation.findById(id);
    if (!nation) {
      return res.status(404).json({ error: 'Nation not found' });
    }

    // Update the fields as needed
    nation.nationalBank = updatedData.nationalBank || nation.nationalBank;
    nation.soldiersAmount = updatedData.soldiersAmount || nation.soldiersAmount;

    await nation.save();
    res.status(200).json(nation);
  } catch (error) {
    console.error('Failed to update nation:', error);
    res.status(500).json({ error: 'Failed to update nation' });
  }
});

// Submit a purchase request
router.post('/purchase', async (req, res) => {
  const { username, item, quantity, price } = req.body;
  try {
    const newRequest = new PurchaseRequest({ username, item, quantity, price });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Failed to submit purchase request:', error);
    res.status(500).json({ error: 'Failed to submit purchase request' });
  }
});

// Get all pending purchase requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await PurchaseRequest.find({ status: 'pending' });
    res.json(requests);
  } catch (error) {
    console.error('Failed to fetch requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Approve or deny a purchase request
router.patch('/approve', async (req, res) => {
  const { id, response, status } = req.body;
  try {
    const request = await PurchaseRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update the request status and add the admin's response
    request.status = status;
    request.adminResponse = response;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    console.error('Error approving/denying request:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Get purchase requests for a specific user
router.get('/requests/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const requests = await PurchaseRequest.find({ username });
    res.json(requests);
  } catch (error) {
    console.error('Failed to fetch requests for user:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

module.exports = router;
