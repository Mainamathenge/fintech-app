const Cart = require("../models/cartModel");
const Item = require("../models/itemModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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