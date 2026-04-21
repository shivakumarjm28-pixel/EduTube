const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { updateProgress, getProgressByUser } = require('../controllers/progressController');

router.route('/')
  .post(protect, updateProgress);

router.route('/:userId')
  .get(protect, getProgressByUser);

module.exports = router;
