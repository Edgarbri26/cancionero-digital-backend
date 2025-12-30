const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');
const songsController = require('../controllers/songs.controller');

// Base URL: /api/songs
// GET /api/songs - Get all songs
// GET /api/songs/:id - Get song by ID
// POST /api/songs - Create new song
router.get('/', songsController.getAllSongs);
router.get('/:id', songsController.getSongById);
router.post('/', authenticateToken, authorizeAdmin, songsController.createSong);
router.put('/:id', authenticateToken, authorizeAdmin, songsController.updateSong);

module.exports = router;
