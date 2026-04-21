const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  quizScore: {
    type: Number,
    default: null
  }
}, { timestamps: true });

// Ensure unique progress per user per video
progressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
