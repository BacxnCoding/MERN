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
  const { name, nationalBank, peopleindex, militaryindex, economyindex, people, military, economy } = req.body;

  try {
    // Check if nation name already exists
    const existingNation = await Nation.findOne({ name });
    if (existingNation) {
      return res.status(400).json({ message: 'Nation name already in use' });
    }

    // Create a new nation
    const newNation = new Nation({
      name,
      nationalBank,
      peopleindex,
      militaryindex,
      economyindex,
      people,
      military,
      economy
    });

    await newNation.save();
    res.status(201).json(newNation);
  } catch (error) {
    console.error('Error creating nation:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
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
    const { id } = req.params;
    const deletedNation = await Nation.findByIdAndDelete(id);

    if (!deletedNation) {
      return res.status(404).json({ error: 'Nation not found' });
    }

    // Optionally, you can broadcast this deletion using WebSockets
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
