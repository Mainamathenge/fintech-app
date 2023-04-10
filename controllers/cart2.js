const Cart = require("../models/cartModel");
const Item = require("../models/itemModel");

exports.createCart = catchAsync(async(req , res ,next ) =>{
    const owner = req.user._id;
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({owner});
    const item = await Item.findOne ({_id :itemId});

    // if the item is already in the Model
    if (!item) {
        res.status(404).send({ message: "item not found" });
        return;
    }
        const price = item.price;
        const name = item.name;
    if (cart){
        const itemIndex = cart.items.findIndex((item) => item.itemId ==  itemId);
        if (itemIndex > -1) {
            let product = cart.items[itemIndex];
            product.quantity += quantity;
            cart.bill = cart.items.reduce((acc, curr) => {
               return acc + curr.quantity * curr.price;
           },0)
    }


    

})