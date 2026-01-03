const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');

// All routes require Admin privileges
router.use(authenticateToken, authorizeAdmin);

router.get('/', permissionController.getAllPermissions);

module.exports = router;
