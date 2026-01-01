const express = require('express');
const router = express.Router();
const misaController = require('../controllers/misa.controller');

// Misa CRUD
router.get('/', misaController.getAllMisas);
router.get('/:id', misaController.getMisaById);
router.post('/', misaController.createMisa);
router.put('/:id', misaController.updateMisa);
router.delete('/:id', misaController.deleteMisa);

// Songs in Misa
router.post('/:id/songs', misaController.addSongToMisa);
router.delete('/:id/songs/:misaSongId', misaController.removeSongFromMisa);

module.exports = router;
