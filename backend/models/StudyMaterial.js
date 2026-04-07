const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['notes', 'pyqp']
  },
  subject: {
    type: String,
    required: true,
  },
  chapterName: {
    type: String,
    required: true,
  },
  driveLink: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', StudyMaterialSchema);
