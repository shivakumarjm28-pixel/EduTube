const Progress = require('../models/Progress');

// @desc    Update user progress (video completion, quiz score)
// @route   POST /api/interactive/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { videoId, completed, quizScore } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id, videoId });

    if (progress) {
      if (completed !== undefined) progress.completed = completed;
      if (quizScore !== undefined) progress.quizScore = quizScore;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: req.user.id,
        videoId,
        completed: completed || false,
        quizScore: quizScore || null
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's progress for all videos
// @route   GET /api/interactive/progress/:userId
// @access  Private
const getProgressByUser = async (req, res) => {
  try {
    // Only allow users to fetch their own progress, unless admin (simplification: only self)
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this progress' });
    }

    const progress = await Progress.find({ userId: req.params.userId })
      .populate('videoId', 'title thumbnailUrl');
      
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateProgress,
  getProgressByUser
};
