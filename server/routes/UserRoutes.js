const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

// routes ----------------
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/token', userController.refreshToken);

module.exports = router;