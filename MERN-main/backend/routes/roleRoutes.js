const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const Nation = require('../models/Nation');

// Create a new role
router.post('/roles', async (req, res) => {
    const { nation_id, description, permissions } = req.body;
  
    try {
      // Check if the nation exists before creating a role
      const nation = await Nation.findById(nation_id);
      if (!nation) {
        return res.status(400).json({ error: 'Nation not found' });
      }
  
      // Generate role_Name based on the nation's name and role description
      const role_Name = `${nation.name.replace(/\s+/g, '_')}_${description.toUpperCase()}`;
  
      const newRole = new Role({
        role_Name,
        nation_id,
        description,
        permissions
      });
  
      const savedRole = await newRole.save();
      res.status(201).json(savedRole);
    } catch (error) {
      console.error('Error creating role:', error);  // Log the error details
      res.status(500).json({ error: 'Failed to create role', details: error.message });
    }
  });
  
// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find().populate('nation_id');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

module.exports = router;
