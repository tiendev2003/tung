require("dotenv").config();
const stripe = require("stripe")(`${process.env.STRIPE_KEY}` || null); /// use hardcoded key if env not work

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Thư viện tạo ID duy nhất cho đơn hàng
const crypto = require("crypto-js");
const Order = require("../models/Order");
const axios = require("axios");

const { handleProductQuantity } = require("../lib/stock-controller/others");
const { formatAmountForStripe } = require("../lib/stripe/stripe");
const Product = require("../models/Product");
const { removeCart } = require("./cartController");
const Cart = require("../models/Cart");

const addOrder = async (req, res) => {
  try {
    const productsInCart = req.body.cart;
    console.log(productsInCart);
    let totalPrice = 0;
    let totalOriginalPrice = 0;
    let totalDiscount = 0;
    let orderCart = [];

    for (let i = 0; i < productsInCart.length; i++) {
      const productDetails = await Product.findById(
        productsInCart[i].product._id
      );
      console.log(productDetails);
      const productOriginalPrice =
        productDetails.prices.originalPrice * productsInCart[i].quantity;
      const productPrice =
        productDetails.prices.price * productsInCart[i].quantity;
      const productDiscount = productOriginalPrice - productPrice;
      totalPrice += productPrice;
      totalOriginalPrice += productOriginalPrice;
      totalDiscount += productDiscount;
      orderCart.push({
        id: productsInCart[i].product,
        quantity: productsInCart[i].quantity,
        price: productPrice,
        originalPrice: productOriginalPrice,
        discount: productDiscount,
      });
    }

    const billing = req.body.billing;
    const newOrder = new Order({
      cart: orderCart,
      paymentMethod: req.body.paymentMethod,
      subTotal: totalOriginalPrice,
      user_info: {
        name: `${billing.name}`,
        email: billing.email,
        contact: billing.phone,
        address: billing.address,
        state: billing.state,
        city: billing.city,
        country: billing.country,
        zipCode: billing.zipCode,
      },
      guestCheckout: req.body.guestCheckout,
      discount: totalDiscount,
      total: req.body.totalPrice,
      user: req.user._id,
      confirmed: false,
      status: "Pending",
    });

    const order = await newOrder.save();
    // remove all item in cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(201).json({
      order,
      message: "Order created successfully.",
    });
    // handleProductQuantity(order.cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const addPaymentDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const paymentRefId = req.body.refId;
    order.paymentInfoDetails = {
      payment_id: paymentRefId,
      payment_gateway: "UPI",
      payment_status: "Not Verified",
      payment_response: "Under Verification",
    };
    const updatedOrder = await order.save();
    return res.status(200).json({
      message: "Payment details added successfully.",
      order: updatedOrder,
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// confirm order from admin
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.confirmed = true;
    order.status = "Processing";
    await order.save();
    res.status(200).json({
      message: "Order confirmed successfully.",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// confirm payment from admin
const confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = "Delivered";
    await order.save();
    res.status(200).json({
      message: "Payment confirmed successfully.",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//create payment intent for stripe
const createPaymentIntent = async (req, res) => {
  const { total: amount, cardInfo: payment_intent, email } = req.body;
  // Validate the amount that was passed from the client.
  if (!(amount >= process.env.MIN_AMOUNT && amount <= process.env.MAX_AMOUNT)) {
    return res.status(500).json({ message: "Invalid amount." });
  }
  if (payment_intent.id) {
    try {
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent.id
      );
      // If PaymentIntent has been created, just update the amount.
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent.id,
          {
            amount: formatAmountForStripe(amount, process.env.CURRENCY),
          }
        );
        // console.log("updated_intent", updated_intent);
        return res.send(updated_intent);
      }
    } catch (err) {
      if (err.code !== "resource_missing") {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        return res.status(500).send({ message: errorMessage });
      }
    }
  }
  try {
    // Create PaymentIntent from body params.
    const params = {
      amount: formatAmountForStripe(amount, process.env.CURRENCY),
      currency: process.env.CURRENCY,
      description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? "",
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const payment_intent = await stripe.paymentIntents.create(params);
    // console.log("payment_intent", payment_intent);

    res.send(payment_intent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).send({ message: errorMessage });
  }
};

// get all orders user
const getOrderCustomer = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;
    console.log(req.user);

    const totalDoc = await Order.countDocuments({ user: req.user._id });

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total padding order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // today order amount

    // query for orders
    const orders = await Order.find({ user: req.user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      orders,
      limits,
      pages,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,

      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const paymentWithMomo = async (req, res) => {
  const { orderId, total } = req.body;
  var partnerCode = "MOMOBKUN20180529";
  var accessKey = "klm05TvNBzhg7h7j";
  var secretkey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
  var requestId = partnerCode + new Date().getTime();
  var orderInfo = "pay with MoMo";
  var redirectUrl = "http://localhost:3000/shop";
  var ipnUrl =
    "https://d9cd-116-110-113-2.ngrok-free.app/orders/callback-with-momo";
  var amount = total.toString();
  var requestType = "payWithMethod";
  var extraData = "";
  console.log("Request to MoMo: ", req.body);

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .HmacSHA256(rawSignature, secretkey)
    .toString(crypto.enc.Hex);

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });
  // options for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  console.log("Request to MoMo: ", options);
  // Send the request and handle the response
  try {
    const result = await axios(options);
    if (result.data.resultCode !== 0) {
      return res.status(400).json({
        message: result.data.message,
        data: result.data,
      });
    }
    return res.status(200).json({
      message: "Payment request sent successfully.",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const callbackPaymentMomo = async (req, res) => {
  console.log("MoMo callback: ", req.body);
  const { orderId, resultCode } = req.body;
  if (resultCode === 0) {
    // Payment successful
    const order = await Order.findById(orderId);
    order.status = "Processing";
    await order.save();
  }
  res.status(200).json({ message: "Payment callback received successfully." });
};

module.exports = {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  confirmOrder,
  confirmPayment,
  addPaymentDetails,
  paymentWithMomo,
  callbackPaymentMomo,
};
