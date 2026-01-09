const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generate.controler');

router.post('/song', generateController.searchSongByLyrics);

module.exports = router;
