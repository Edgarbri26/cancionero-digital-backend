const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');

// All routes require Admin privileges
router.use(authenticateToken, authorizeAdmin);

router.get('/', usersController.getAllUsers);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
