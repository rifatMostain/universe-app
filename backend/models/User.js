const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: String,
  
  // Personal Information
  personal: {
    preferred_name: String,
    date_of_birth: Date,
    gender: String,
    nationality: String,
    passport_number: String,
    phone_number: String,
    address_city: String,
    address_district: String,
    address_country: String
  },
  
  // Academic Background
  academic: {
    current_status: String,
    undergraduate_university_name: String,
    undergraduate_country: String,
    undergraduate_degree: String,
    undergraduate_department: String,
    undergraduate_cgpa: Number,
    cgpa_scale: Number,
    percentage: Number,
    class_position: Number,
    undergraduate_start_year: Number,
    undergraduate_end_year: Number,
    university_ranking: String,
    thesis_title: String,
    postgraduate_degree: String,
    postgraduate_university: String,
    postgraduate_cgpa: Number
  },
  
  // Secondary Education
  secondary: {
    hsc_exam_type: String,
    hsc_board: String,
    hsc_college: String,
    hsc_group: String,
    hsc_gpa: Number,
    hsc_year: Number,
    ssc_exam_type: String,
    ssc_board: String,
    ssc_school: String,
    ssc_gpa: Number,
    ssc_year: Number
  },
  
  // Test Scores
  testScores: {
    ielts: {
      has_taken: Boolean,
      overall_band: Number,
      listening: Number,
      reading: Number,
      writing: Number,
      speaking: Number,
      test_date: Date,
      valid_until: Date
    },
    toefl: {
      has_taken: Boolean,
      total_score: Number,
      test_date: Date
    },
    duolingo: {
      score: Number,
      test_date: Date
    },
    gre: {
      has_taken: Boolean,
      total_score: Number,
      quantitative: Number,
      verbal: Number,
      analytical_writing: Number,
      test_date: Date
    },
    gmat: {
      has_taken: Boolean,
      score: Number
    }
  },
  
  // Study Preferences
  preferences: {
    target_degree: String,
    program: String,
    specialization: String,
    target_countries: [String],
    preferred_country: String,
    university_tier_preference: String,
    funding_preference: String,
    intake_preference: String
  },
  
  // Professional Experience
  experience: [{
    company: String,
    position: String,
    start_date: Date,
    end_date: Date,
    description: String,
    is_current: Boolean
  }],
  
  // Research & Publications
  research: {
    interests: [String],
    publications: [{
      title: String,
      authors: String,
      journal: String,
      year: Number,
      link: String
    }]
  },
  
  // Skills
  skills: {
    programming_languages: [String],
    frameworks: [String],
    tools: [String],
    soft_skills: [String],
    languages: [{
      language: String,
      proficiency: String
    }]
  },
  
  // Financial
  financial: {
    personal_savings: Number,
    family_support: Number,
    looking_for_scholarship: Boolean,
    loan_required: Boolean,
    total_budget: Number
  },
  
  // Saved SOP Drafts
  sopDrafts: [{
    sopContent: {
      type: String,
      required: true
    },
    targetUniversity: String,
    program: String,
    degreeLevel: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to get user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
