const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Mock data for exams/courses
const exams = [
  { id: 1, title: 'SBI PO', category: 'Bank', students: '20k+' },
  { id: 2, title: 'IBPS Clerk', category: 'Bank', students: '30k+' },
  { id: 3, title: 'SSC CGL', category: 'SSC', students: '40k+' },
  { id: 4, title: 'TNPSC Group 2', category: 'State', students: '50k+' }
];

router.get('/exams', (req, res) => {
  res.json(exams);
});

router.post('/lead', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ message: 'Lead submitted successfully', lead: newLead });
  } catch (error) {
      console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');

router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({});
    // The admin's roll number is 1234 but we might just count everyone or deduct 1 for the admin. 
    // Let's assume all users listed are students for now.
    
    const notesCount = await StudyMaterial.countDocuments({ category: 'notes' });
    const pyqpCount = await StudyMaterial.countDocuments({ category: 'pyqp' });

    res.json({
      totalStudents: totalStudents > 0 ? totalStudents : 0,
      notesCount: notesCount || 0,
      pyqpCount: pyqpCount || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
