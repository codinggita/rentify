const express = require('express');
const router = express.Router();
const InspectionTask = require('../models/InspectionTask');
const { authenticate } = require('../middleware/auth');

// Get all inspections
router.get('/', authenticate, async (req, res) => {
  try {
    const inspections = await InspectionTask.find().populate('property').populate('inspector', 'name email');
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create inspection
router.post('/', authenticate, async (req, res) => {
  const inspection = new InspectionTask(req.body);
  try {
    const newInspection = await inspection.save();
    res.status(201).json(newInspection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign/Update inspection
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const updatedInspection = await InspectionTask.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: req.body.inspector ? 'ASSIGNED' : 'PENDING' },
      { new: true }
    ).populate('property').populate('inspector', 'name email');
    res.json(updatedInspection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
