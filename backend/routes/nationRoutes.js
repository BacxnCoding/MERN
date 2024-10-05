const express = require('express');
const Nation = require('../models/Nation');
const router = express.Router();

// Fetch all nations
router.get('/', async (req, res) => {
  try {
    const nations = await Nation.find();
    res.json(nations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nations' });
  }
});

// Fetch a single nation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const nation = await Nation.findById(id);

    if (!nation) {
      return res.status(404).json({ error: 'Nation not found' });
    }

    res.json(nation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nation' });
  }
});

// Create a new nation
router.post('/', async (req, res) => {
  try {
    const newNation = new Nation(req.body);
    const savedNation = await newNation.save();

    console.log('Nation created:', savedNation);  // Log nation creation
    process.nextTick(() => {
      console.log('Broadcasting nation creation to WebSocket clients');  // Log WebSocket broadcast
      notifyClients(req.wss, { type: 'nation-create', nation: savedNation });
    });

    res.status(201).json(savedNation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create nation' });
  }
});

// Update nation by ID
router.patch('/:id', async (req, res) => {
  try {
    const updatedNation = await Nation.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedNation) {
      return res.status(404).json({ error: 'Nation not found' });
    }

    console.log('Nation updated:', updatedNation);  // Log nation update
    process.nextTick(() => {
      console.log('Broadcasting nation update to WebSocket clients');  // Log WebSocket broadcast
      notifyClients(req.wss, { type: 'nation-update', nation: updatedNation });
    });

    res.json(updatedNation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update nation' });
  }
});

// Delete a nation by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedNation = await Nation.findByIdAndDelete(req.params.id);

    if (!deletedNation) {
      return res.status(404).json({ error: 'Nation not found' });
    }

    console.log('Nation deleted:', deletedNation);  // Log nation deletion
    process.nextTick(() => {
      console.log('Broadcasting nation deletion to WebSocket clients');  // Log WebSocket broadcast
      notifyClients(req.wss, { type: 'nation-delete', nationId: deletedNation._id });
    });

    res.json({ message: 'Nation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete nation' });
  }
});

// WebSocket notification function
const notifyClients = (wss, message) => {
  console.log('Notifying WebSocket clients:', message);  // Log the WebSocket message being sent
  if (wss && wss.clients) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {  // WebSocket.OPEN is 1
        client.send(JSON.stringify(message));
      }
    });
  }
};

module.exports = router;
