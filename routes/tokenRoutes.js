const express = require("express");
const router=express.Router();
const {createToken, postStk}= require("../controllers/tokenController");

router.post("/",postStk);
//router.post("/",createToken);

module.exports=router;