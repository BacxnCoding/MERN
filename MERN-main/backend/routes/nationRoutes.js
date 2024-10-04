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

// Get a single nation by ID
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
    const { 
      name, 
      nationalBank, 
      peopleindex, 
      militaryindex, 
      economyindex, 
      people, 
      military, 
      economy 
    } = req.body;

    // Create a new nation
    const newNation = new Nation({
      name,
      nationalBank,
      peopleindex,   // Index value for people
      militaryindex, // Index value for military
      economyindex,  // Index value for economy
      people: {
        TotalBudget: people.TotalBudget || 0,
        health: {
          procedures: people.health?.procedures || 0,
          vaccines: people.health?.vaccines || 0,
          hospitals: people.health?.hospitals || 0,
        },
        satisfaction: {
          infrastructure: people.satisfaction?.infrastructure || 0,
          politicalStability: people.satisfaction?.politicalStability || 0,
          education: people.satisfaction?.education || 0,
          internalSafety: people.satisfaction?.internalSafety || 0,
          freedom: people.satisfaction?.freedom || 0,
          economy: people.satisfaction?.economy || 0,
        },
        productivity: people.productivity || 0,
      },
      military: {
        TotalBudget: military.TotalBudget || 0,
        personnel: {
          training: military.personnel?.training || 0,
          wellBeing: military.personnel?.wellBeing || 0,
        },
        equipment: {
          bases: military.equipment?.bases || 0,
          ports: military.equipment?.ports || 0,
          communication: military.equipment?.communication || 0,
          equipmentQuality: military.equipment?.equipmentQuality || 0,
        },
        performance: military.performance || 0,
      },
      economy: {
        inflation: economy.inflation || 0,
        income: {
          taxRate: economy.income?.taxRate || 0,
          exports: economy.income?.exports || 0,
        },
        spending: {
          debt: economy.spending?.debt || 0,
          imports: economy.spending?.imports || 0,
        },
      },
    });

    // Save the new nation to the database
    await newNation.save();
    res.status(201).json(newNation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create nation', details: error.message });
  }
});

module.exports = router;


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
