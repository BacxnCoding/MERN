const express = require('express');
const router = express.Router();
const PurchaseRequest = require('../models/PurchaseRequest');

// Fetch all purchase requests
router.get('/', async (req, res) => {
  try {
    const requests = await PurchaseRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase requests' });
  }
});

// Fetch a purchase request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await PurchaseRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase request' });
  }
});

// Create a new purchase request
router.post('/create', async (req, res) => {
  try {
    const newRequest = new PurchaseRequest(req.body);
    const savedRequest = await newRequest.save();

    // Notify clients
    notifyClients({ type: 'purchase-create', purchase: savedRequest });

    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase request' });
  }
});

// Approve or deny a purchase request (this is the new route)
router.patch('/approve/:id', async (req, res) => {
  const { status, response } = req.body;
  try {
    const request = await PurchaseRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }

    // Update the status and add the admin's response
    request.status = status;
    request.adminResponse = response;
    await request.save();

    // Notify clients about the update
    notifyClients({ type: 'purchase-update', purchase: request });

    res.status(200).json(request);
  } catch (error) {
    console.error('Error approving/denying request:', error);
    res.status(500).json({ error: 'Failed to update purchase request' });
  }
});

// Delete a purchase request by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRequest = await PurchaseRequest.findByIdAndDelete(req.params.id);

    // Notify clients
    notifyClients({ type: 'purchase-delete', purchaseId: deletedRequest._id });

    res.json({ message: 'Purchase request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete purchase request' });
  }
});

// WebSocket notification function
const notifyClients = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = router;
