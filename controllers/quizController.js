const Quiz = require('../models/Quiz');

// @desc    Create a quiz for a video
// @route   POST /api/interactive/quizzes
// @access  Private/Creator
const createQuiz = async (req, res) => {
  try {
    const { videoId, questions } = req.body;

    const quiz = await Quiz.create({
      videoId,
      questions
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz for a specific video
// @route   GET /api/interactive/quizzes/:videoId
// @access  Public (or Private depending on requirements)
const getQuizByVideoId = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ videoId: req.params.videoId });

    if (quiz) {
      res.json({
        _id: quiz._id,
        videoId: quiz.videoId,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options
        }))
      });
    } else {
      res.status(404).json({ message: 'Quiz not found for this video' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizByVideoId
};
