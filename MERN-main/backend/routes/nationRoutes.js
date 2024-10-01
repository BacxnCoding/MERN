const express = require('express');
const Nation = require('../models/Nation');

const router = express.Router();

// Get all nations
router.get('/', async (req, res) => {
  try {
    const nations = await Nation.find();
    res.json(nations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nations' });
  }
});

// Update nation stats (PUT request)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nationalBank, soldiersAmount } = req.body;
    const updatedNation = await Nation.findByIdAndUpdate(
      id,
      { nationalBank, soldiersAmount },
      { new: true }
    );
    res.json(updatedNation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update nation' });
  }
});

// Create a new nation with values from the request body
router.post('/', async (req, res) => {
  try {
    const { name, nationalBank, soldiersAmount, people, military, economy } = req.body;

    // Create a new nation
    const newNation = new Nation({
      name,
      nationalBank,
      soldiersAmount,
      people,
      military,
      economy,
    });

    // Save the new nation to the database
    await newNation.save();
    res.status(201).json(newNation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create nation' });
  }
});

// Patch nation (update specific fields)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // The fields to update are sent in the request body

    // Update only the fields provided in the request
    const updatedNation = await Nation.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedNation) {
      return res.status(404).json({ error: 'Nation not found' });
    }

    res.json(updatedNation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update nation' });
  }
});

// DELETE nation by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the nation by ID and delete it
    const deletedNation = await Nation.findByIdAndDelete(id);

    if (!deletedNation) {
      return res.status(404).json({ error: 'Nation not found' });
    }

    res.json({ message: 'Nation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete nation' });
  }
});

module.exports = router;
