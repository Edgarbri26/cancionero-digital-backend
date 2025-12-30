const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artists.controller');

router.get('/', artistsController.getAllArtists);
router.post('/', artistsController.createArtist);

module.exports = router;
