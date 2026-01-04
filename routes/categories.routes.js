const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, categoriesController.getAllCategories);
router.post('/', categoriesController.createCategory);

module.exports = router;
