const express = require('express');
const router = express.Router();
const { protect, creatorOnly } = require('../middlewares/authMiddleware');
const { createQuiz, getQuizByVideoId } = require('../controllers/quizController');

router.route('/quizzes')
  .post(protect, creatorOnly, createQuiz);

router.route('/quizzes/:videoId')
  .get(getQuizByVideoId); // Add `protect` here if you want only logged-in users to see quizzes

module.exports = router;
