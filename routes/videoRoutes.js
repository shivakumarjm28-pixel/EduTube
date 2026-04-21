const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect, creatorOnly } = require('../middlewares/authMiddleware');
const {
  getVideos,
  getVideoById,
  uploadVideo,
  likeVideo,
  commentOnVideo
} = require('../controllers/videoController');

router.route('/')
  .get(getVideos)
  .post(protect, creatorOnly, upload.single('video'), uploadVideo);

router.route('/:id')
  .get(getVideoById);

router.route('/:id/like')
  .post(protect, likeVideo);

router.route('/:id/comments')
  .post(protect, commentOnVideo);

module.exports = router;
