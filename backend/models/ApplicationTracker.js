const mongoose = require('mongoose');

const applicationTrackerSchema = new mongoose.Schema({
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
  program: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Applied', 'Interview', 'Accepted', 'Rejected', 'Waitlisted'],
    default: 'Not Started'
  },
  applicationDetails: {
    applicationDate: Date,
    interviewDate: Date,
    decisionDate: Date,
    tuitionFee: Number,
    scholarshipOffered: Number
  },
  documents: [{
    name: String,
    uploaded: {
      type: Boolean,
      default: false
    },
    uploadedDate: Date
  }],
  notes: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
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

// Indexes for efficient queries
applicationTrackerSchema.index({ userId: 1, status: 1 });
applicationTrackerSchema.index({ userId: 1, deadline: 1 });
applicationTrackerSchema.index({ userId: 1, universityName: 1, program: 1 });

// Update timestamp before saving
applicationTrackerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update application status
applicationTrackerSchema.methods.updateStatus = function(newStatus, additionalData = {}) {
  this.status = newStatus;
  
  // Update relevant dates based on status
  if (newStatus === 'Applied' && !this.applicationDetails.applicationDate) {
    this.applicationDetails.applicationDate = new Date();
  } else if (newStatus === 'Interview' && additionalData.interviewDate) {
    this.applicationDetails.interviewDate = additionalData.interviewDate;
  } else if (['Accepted', 'Rejected', 'Waitlisted'].includes(newStatus)) {
    this.applicationDetails.decisionDate = new Date();
  }
  
  return this.save();
};

// Static method to get applications by status for a user
applicationTrackerSchema.statics.getByStatus = function(userId, status) {
  return this.find({ userId, status }).sort({ deadline: 1 });
};

// Static method to get upcoming deadlines
applicationTrackerSchema.statics.getUpcomingDeadlines = function(userId, days = 30) {
  const today = new Date();
  const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    userId,
    deadline: {
      $gte: today,
      $lte: futureDate
    },
    status: { $in: ['Not Started', 'In Progress'] }
  }).sort({ deadline: 1 });
};

const ApplicationTracker = mongoose.model('ApplicationTracker', applicationTrackerSchema);

module.exports = ApplicationTracker;
