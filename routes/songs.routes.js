const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin, authorizePermission } = require('../middleware/auth.middleware');
const songsController = require('../controllers/songs.controller');

// Base URL: /api/songs
// GET /api/songs - Get all songs
// GET /api/songs/:id - Get song by ID
// POST /api/songs - Create new song
router.get('/', songsController.getAllSongs);
router.get('/:id', songsController.getSongById);
router.post('/', authenticateToken, authorizePermission('song.create'), songsController.createSong);
router.put('/:id', authenticateToken, authorizePermission('song.edit'), songsController.updateSong);
router.delete('/:id', authenticateToken, authorizePermission('song.delete'), songsController.deleteSong);

module.exports = router;
