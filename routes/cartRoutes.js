const express = require('express');
const Cart = require('../models/cartModel');
// const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = new express.Router();

router.post('/create', cartController.createCart );
router.delete('/delete', cartController.deleteItem);
//router.route('/order');
module.exports = router ;
