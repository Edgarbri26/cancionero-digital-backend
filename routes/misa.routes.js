const express = require('express');
const router = express.Router();
const misaController = require('../controllers/misa.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Misa CRUD
router.get('/', misaController.getAllMisas);
router.get('/:id', misaController.getMisaById);
router.post('/', authenticateToken, misaController.createMisa);
router.put('/:id', authenticateToken, misaController.updateMisa);
router.delete('/:id', authenticateToken, misaController.deleteMisa);

// Songs in Misa
router.post('/:id/songs', authenticateToken, misaController.addSongToMisa);
router.delete('/:id/songs/:misaSongId', authenticateToken, misaController.removeSongFromMisa);

module.exports = router;
