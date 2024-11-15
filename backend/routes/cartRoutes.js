const express = require('express');
const { addTocart, removeCart, getCart, removeItem, updateCartQuantity } = require('../controller/cartController');
const { isAuth } = require('../config/auth');
const router = express.Router();



router.post('/add',isAuth , addTocart);
router.get('/get',isAuth , getCart);
router.delete('/remove',isAuth , removeCart);
router.put('/item',isAuth ,  removeItem);
router.put('/update', isAuth, updateCartQuantity);  


module.exports = router;