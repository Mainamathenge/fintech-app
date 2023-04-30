const express = require('express');
const Cart = require('../models/cartModel');
// const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = new express.Router();

router.post('/create', cartController.createCart );
router.delete('/delete', cartController.deleteItem);
router.post('/checkout',cartController.payment);
router.post("/callback", cartController.safcallback);

module.exports = router ;
