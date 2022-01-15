const express = require('express')
const router = express.Router()
// const Fetch = require('../service/Fetch');
const youtubeController = require('../controllers/youtubeController')

router.post('/search-on-youtube', youtubeController.search)
router.post('/search-on-youtube-new', youtubeController.searchNew)
router.post('/youtube-most-popular', youtubeController.mostPopular)
router.post('/related-to-video', youtubeController.relatedToVideo)
router.post('/video-full-data', youtubeController.videoFullData)
router.post('/video-comments', youtubeController.videoComments)
router.post('/test-fetch', youtubeController.testFetch) // only for fetch test
router.post('/mail', youtubeController.mail) // only for mail test

module.exports = router
