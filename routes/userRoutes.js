const express = require('express');
const User = require('../models/userModel');
const authController = require('../controllers/authController');
//const userController = require('../controllers/userController');

// instatiating the new router
//router.get('/', viewController.getOverview);
const router = new express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;