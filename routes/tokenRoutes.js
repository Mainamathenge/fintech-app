const express = require("express");
const router=express.Router();
const {createToken, postStk, callback }= require("../controllers/tokenController");

router.post("/",createToken,postStk);
//router.post("/");
router.post("/callback", callback);

module.exports=router;