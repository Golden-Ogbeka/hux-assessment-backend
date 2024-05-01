const express = require('express');
const UserRoutes = require('./user');
const ContactRoutes = require('./contact');

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/contact', ContactRoutes);

module.exports = router;
