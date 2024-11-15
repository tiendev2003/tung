const Product = require("../models/Product");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Attribute = require("../models/Attribute");
const Cart = require("../models/Cart");
const addTocart = async (req, res) => {
  const { productId, variant, quantity, price } = req.body;
  const userId = req.user._id;
  console.log(variant);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, variant, quantity });
    }
    const pr =
      Number.parseInt(product.prices.price) ||
      Number.parseInt(product.prices.originalPrice);
    cart.totalPrice += pr * quantity;
    product.stock -= quantity;
    await product.save();
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      model: "Product",
    });

    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const removeCart = async (req, res) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const removeItem = async (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.body;
  console.log(req.body);
  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      model: "Product",
    });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    console.log(itemIndex);
    if (itemIndex > -1) {
      const product = await Product.findById(cart.items[itemIndex].product._id);
      product.stock += cart.items[itemIndex].quantity;
      cart.totalPrice -=
        product.prices.price ||
        product.prices.originalPrice * cart.items[itemIndex].quantity;
      cart.items.splice(itemIndex, 1);
      await product.save();
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const updateCartQuantity = async (req, res) => {
  const userId = req.user._id;
  const { productId, variant, quantity } = req.body;
  console.log(req.body);

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      model: "Product",
    });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product._id.toString() === productId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (itemIndex === -1) {
      return res.status(400).json({ message: "Product not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    if (product.stock < quantity - cart.items[itemIndex].quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    product.stock -= quantity - cart.items[itemIndex].quantity;
    console.log(quantity)
    console.log(cart.items[itemIndex].quantity)
    const newPrice =
      Number.parseInt(product.prices.price) ||
      Number.parseInt(product.prices.originalPrice) 
    const oldPrice =
      Number.parseInt(product.prices.price) ||
      Number.parseInt(product.prices.originalPrice) ;
       
    const updatePrice = newPrice*quantity - oldPrice * cart.items[itemIndex].quantity;
    console.log(newPrice);
    console.log(oldPrice);
    console.log(updatePrice);
    console.log(cart.totalPrice);

    cart.totalPrice += updatePrice;
    cart.items[itemIndex].quantity = quantity;
    await product.save();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTocart,
  getCart,
  removeCart,
  removeItem,
  updateCartQuantity,
};
