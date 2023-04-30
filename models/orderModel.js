const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Cart'
  },
  checkoutId :{
    type : String,
    required : true
  },
  amount : {
    type : Number,
    required : true
  },
  mpesaCode :{
    type : String
  },
  status: {
    type: String,
    enum: ['Pending','awaiting_payment','shipping','Completed'],
    required: true,
    default: 'Pending'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;