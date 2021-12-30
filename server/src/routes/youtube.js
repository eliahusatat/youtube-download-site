const express = require('express');
const router = express.Router();
// const Fetch = require('../service/Fetch');
const youtubeController = require('../controllers/youtubeController');

router.post('/search-on-youtube', youtubeController.search);
router.post('/search-on-youtube-new', youtubeController.search_new);
router.post('/youtube-most-popular', youtubeController.most_popular);
router.post('/test-fetch', youtubeController.test_fetch); // only for fetch test
router.post('/mail', youtubeController.mail); // only for mail test




module.exports = router;