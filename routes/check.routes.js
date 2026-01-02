const express = require('express');
const router = express.Router();
const checkController = require('../controllers/check.controller');

router.get('/', checkController.checkConnection);

module.exports = router;
