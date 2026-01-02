const mongoose = require('mongoose');

const savedUniversitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  universityName: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  program: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  requirements: {
    minimumGPA: Number,
    requiredTests: [String],
    applicationFee: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for user and university
savedUniversitySchema.index({ userId: 1, universityName: 1, program: 1 });

// Update timestamp before saving
savedUniversitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SavedUniversity = mongoose.model('SavedUniversity', savedUniversitySchema);

module.exports = SavedUniversity;
