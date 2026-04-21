const Video = require('../models/Video');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('creatorId', 'username, email')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('creatorId', 'username email')
      .populate('comments.user', 'username');

    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload a video
// @route   POST /api/videos
// @access  Private/Creator
const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a video file' });
    }

    const videoUrl = `/uploads/${req.file.filename}`;

    const video = await Video.create({
      title,
      description,
      videoUrl,
      creatorId: req.user.id
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or Unlike a video
// @route   POST /api/videos/:id/like
// @access  Private
const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if user has already liked
    const alreadyLiked = video.likes.includes(req.user.id);

    if (alreadyLiked) {
      video.likes = video.likes.filter(id => id.toString() !== req.user.id.toString());
    } else {
      video.likes.push(req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes.length, isLiked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to video
// @route   POST /api/videos/:id/comments
// @access  Private
const commentOnVideo = async (req, res) => {
  try {
    const { text } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const newComment = {
      user: req.user.id,
      text
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).json(video.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  uploadVideo,
  likeVideo,
  commentOnVideo
};
