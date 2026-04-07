const express = require('express');
const router = express.Router();
const StudyMaterial = require('../models/StudyMaterial');

// @route   POST /api/materials
// @desc    Add new study material (Admin)
router.post('/', async (req, res) => {
  try {
    const { grade, category, subject, chapterName, driveLink } = req.body;
    
    // In a real app we would check headers for Admin JWT here!
    
    const newMaterial = new StudyMaterial({
      grade,
      category,
      subject,
      chapterName,
      driveLink
    });

    await newMaterial.save();
    res.status(201).json({ message: 'Study material added successfully', material: newMaterial });
  } catch (error) {
    console.error('Error adding material:', error);
    res.status(500).json({ message: 'Server error adding material' });
  }
});

// @route   GET /api/materials
// @desc    Retrieve materials filtered by query
router.get('/', async (req, res) => {
  try {
    const { grade, category, subject } = req.query;
    
    // Build dynamic query object
    const query = {};
    if (grade) query.grade = grade;
    if (category) query.category = category;
    if (subject) query.subject = subject;

    const materials = await StudyMaterial.find(query).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ message: 'Server error fetching materials' });
  }
});

// @route   PUT /api/materials/:id
// @desc    Update material
router.put('/:id', async (req, res) => {
  try {
    const updatedMaterial = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.status(200).json({ message: 'Material updated successfully', material: updatedMaterial });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ message: 'Server error updating material' });
  }
});

module.exports = router;
