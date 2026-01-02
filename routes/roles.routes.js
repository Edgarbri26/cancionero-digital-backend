const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');

// All routes require Admin privileges
router.use(authenticateToken, authorizeAdmin);

router.get('/', rolesController.getAllRoles);

module.exports = router;
