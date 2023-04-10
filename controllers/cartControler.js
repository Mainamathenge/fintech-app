const catchAsync = require("../utils/catchAsync");

router.post("/cart", Auth, async (req, res) => {
    const owner = req.user._id;
    const { itemId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ owner });
        const item = await Item.findOne({ _id: itemId });
    if (!item) {
        res.status(404).send({ message: "item not found" });
        return;
    }
        const price = item.price;
        const name = item.name;
    //If cart already exists for user,
    if (cart) {
        const itemIndex = cart.items.findIndex((item) => item.itemId ==  itemId);
    //check if product exists or not
    if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;
        cart.bill = cart.items.reduce((acc, curr) => {
           return acc + curr.quantity * curr.price;
       },0)
    cart.items[itemIndex] = product;
       await cart.save();
       res.status(200).send(cart);
    } else {
       cart.items.push({ itemId, name, quantity, price });
       cart.bill = cart.items.reduce((acc, curr) => {
       return acc + curr.quantity * curr.price;
    },0)
       await cart.save();
       res.status(200).send(cart);
    }
    } else {
    //no cart exists, create one
    const newCart = await Cart.create({
       owner,
       items: [{ itemId, name, quantity, price }],
        bill: quantity * price,
    });
    return res.status(201).send(newCart);
    }
    } catch (error) {
       console.log(error);
       res.status(500).send("something went wrong");
    }
    });
