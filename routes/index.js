const express = require('express');
const router = express.Router();

const songsRoutes = require('./songs.routes');
const categoriesRoutes = require('./categories.routes');


router.use('/auth', require('./auth.routes'));
router.use('/songs', songsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/stats', require('./stats.routes'));

module.exports = router;
