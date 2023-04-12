const express = require('express');
const Cart = require('../models/cartModel');
// const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = new express.Router();

router.post('/create', cartController.createCart );
router.post('/delete', cartController.deleteItem);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);
module.exports = router ;