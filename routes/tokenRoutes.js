const express = require("express");
const router=express.Router();
const {createToken, postStk, callback }= require("../controllers/tokenController");

//router.post("/",createToken);
router.post("/",postStk);
router.post("/callback", callback);

module.exports=router;