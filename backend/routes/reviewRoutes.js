const express = require("express");
const router = express.Router();
 
const { isAuth } = require("../config/auth");
const { addReview } = require("../controller/productController");

//add a product
router.post("/add", isAuth,addReview);

 
module.exports = router;
