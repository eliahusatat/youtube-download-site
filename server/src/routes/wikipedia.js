const express = require('express');
const router = express.Router();
// const Fetch = require('../service/Fetch');
const wikipediaController = require('../controllers/wikipediaController');

router.post('/search-on-wikipedia', wikipediaController.search);


module.exports = router;