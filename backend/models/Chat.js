const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [messageSchema],
  chatType: {
    type: String,
    enum: ['general', 'sop', 'cv', 'professor', 'scholarship'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    totalMessages: {
      type: Number,
      default: 0
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
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
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, isActive: 1 });

// Update metadata before saving
chatSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.metadata.totalMessages = this.messages.length;
    this.metadata.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  this.updatedAt = Date.now();
  next();
});

// Method to add a message to the chat
chatSchema.methods.addMessage = function(role, content) {
  this.messages.push({ role, content });
  return this.save();
};

// Method to get recent chats for a user
chatSchema.statics.getRecentChats = function(userId, limit = 10) {
  return this.find({ userId, isActive: true })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('title chatType metadata.lastMessageAt createdAt');
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
