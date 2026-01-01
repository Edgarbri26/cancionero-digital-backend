const express = require('express');
const router = express.Router();
const momentController = require('../controllers/moment.controller');

router.get('/', momentController.getAllMoments);
router.post('/', momentController.createMoment);

module.exports = router;
