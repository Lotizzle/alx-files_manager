// routes/index.js
const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

// Define the routes and their corresponding handlers
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
