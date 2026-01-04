const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const permissionController = require('../controllers/permission.controller');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');

// All routes require Admin privileges
router.use(authenticateToken, authorizeAdmin);

router.get('/', rolesController.getAllRoles);
router.post('/', rolesController.createRole);
router.put('/:id', rolesController.updateRole);
router.put('/:roleId/permissions', permissionController.updateRolePermissions);

module.exports = router;
