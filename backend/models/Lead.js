const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  course: { type: String },
  state: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
