const express = require('express');
const router = express.Router();
// const Fetch = require('../service/Fetch');
const youtubeController = require('../controllers/youtubeController');

router.post('/search-on-youtube', youtubeController.search);
router.post('/search-on-youtube-new', youtubeController.search_new);
router.post('/youtube-most-popular', youtubeController.most_popular);
router.post('/related-to-video', youtubeController.related_to_video);
router.post('/video-full-data', youtubeController.video_full_data);
router.post('/video-comments', youtubeController.video_comments);
router.post('/test-fetch', youtubeController.test_fetch); // only for fetch test
router.post('/mail', youtubeController.mail); // only for mail test




module.exports = router;