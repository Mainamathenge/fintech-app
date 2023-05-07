const express = require('express');
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('Retailer','Admin'));
router
  .route('/')
  .get(itemController .getAllItem)
  .post(itemController .createItem);
//router.post ('/', )

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
