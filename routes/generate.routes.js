const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generate.controler');

router.post('/', generateController.generate);
router.post('/autocomplete', generateController.autocompleteChordsForLyrics);

module.exports = router;
