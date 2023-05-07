const Cart = require("../models/cartModel");
const Item = require("../models/itemModel");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
//const MpesaC2bAPI = require('../utils/mpesaC2B');
const AppError = require("../utils/appError");
const LipaNaMpesa = require("../utils/my-mpesa")

const order_payment = new LipaNaMpesa();

exports.createCart = catchAsync(async(req , res ,next ) =>{
    const owner = req.body.owner;
    const itemId = req.body.items[0]['itemId'];
    const quantity = req.body.items[2]['quantity'];
    //console.log(itemId);
    //const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({owner});
    const item = await Item.findOne ({_id : itemId});
    

    // if the item is already in the Model
    if (!item) {
        res.status(404).send({ message: "item not found" });
        return;
    }
        const price = item.price;
        const name = item.name;
    if (cart){
        const itemIndex = cart.items.findIndex((item) => item.itemId ==  itemId);
        // if the product does not exist in the cart
        if (itemIndex > -1) {
            let product = cart.items[itemIndex];
            product.quantity += quantity;
            cart.bill = cart.items.reduce((acc, curr) => {
               return acc + curr.quantity * curr.price;
           },0)
           cart.items[itemIndex] = product;
           await cart.save();
           res.status(200).send(cart);
           } 
            else {
            cart.items.push({ itemId, name, quantity, price });
            cart.bill = cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
         },0)
            await cart.save();
            res.status(200).send(cart);
        } 
        } 
        else if(!cart) {
            //no cart exists, create one
            const newCart = await Cart.create({
                owner,
                items: [{ itemId, name, quantity, price }],
                bill: quantity * price,
            });
            return res.status(201).send(newCart);
            }
        else {
        next(
        new AppError('Cart could not be created', 403));
        } 
    });

exports.deleteItem = catchAsync( async(req , res ) => {
    const owner = req.body.owner;
    const itemId = req.body.item;
       let cart = await Cart.findOne({ owner });
       console.log(cart);
   
       const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
       
       if (itemIndex > -1) {
         let item = cart.items[itemIndex];
         cart.bill -= item.quantity * item.price;
         if(cart.bill < 0) {
             cart.bill = 0
         } 
         cart.items.splice(itemIndex, 1);
         cart.bill = cart.items.reduce((acc, curr) => {
           return acc + curr.quantity * curr.price;
       },0)
         cart = await cart.save();
   
         res.status(200).send(cart);
       } else {
       res.status(404).send("item not found");
       }

});

exports.checkout = catchAsync( async(req , res ) => {
    const owner = req.body.owner;
    const number = req.body.phone;
    const _id  = req.body.cart;
    console.log(_id);
    let cart = await Cart.findOne({ _id });
    postStk(phone, amount);
    const response = await mpesaC2bService.initiatePayment(
        cart.bill,
        number,
    );

    console.log(cart.bill);

});

exports.payment = catchAsync(async (req, res, next) => {
    //from api
    const phone = req.body.phone.substring(1);
    const cart = req.body.cart;
    const items = await Cart.findOne({_id : cart});
    cartId = items._id.toString().substr(0, 24);
    owner = items.owner.toString().substr(0, 24);
    amount = items.bill;
    //Getting response and and checkout id from safaricom when stk push is sent
    const response = await order_payment.postStk(
      amount,
      phone
    );
    checkoutId = response.data.CheckoutRequestID;
    // Creating the oder details for confirmation details.
    const newPayment = await Order.create({
        owner,
        cart,
        checkoutId,
        amount,

    });
    res.status(200).json(newPayment);
  });

//payment call back from safaricom

 exports.safcallback = catchAsync(async(req,res,next )=>{
    const mpesa_response = req.body;
    console.log(mpesa_response);
    if (mpesa_response.Body.stkCallback.ResultCode !== 0) {
        return;
    }
    checkoutId = mpesa_response.Body.stkCallback.CheckoutRequestID;
    code = mpesa_response.Body.stkCallback.CallbackMetadata.Item[1].Value;

    console.log(typeof code);

    const filter = {
        checkoutId : checkoutId
    };

    const update = {
        status : 'Completed',
        mpesaCode : code
    };

    let doc = await Order.findOneAndUpdate(filter, update,{new : true});

    console.log(doc);

    // const order = await Order.findOne({checkoutId });

 
    // const order = await Order.findOne({
    // CheckoutRequestID: req.body.Body.stkCallback.CheckoutRequestID,
    // });
    res.status(200).json(doc);

 }) 