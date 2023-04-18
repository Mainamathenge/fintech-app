const express = require("express");
const router=express.Router();
const {createToken, postStk}= require("../controllers/tokenController");

// router.post("/",createToken,postStk);
router.post("/",postStk);

module.exports=router;