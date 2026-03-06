const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generate.controler');

router.post('/song', generateController.searchSongByLyrics);
router.post('/image', generateController.searchSongByImage);

module.exports = router;
