require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Customer = require("../models/Customer");

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      return res.status(401).send({
        message: "No Token",
      });
    }
    const token = authorization.split(" ")[1];
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

const guestAuth = async(req, res, next) => {
  try {
    const {guestCheckout, billing} = req.body;
    if(!guestCheckout){
      return res.status(500).json({
        error: "Error: Guest Checkout not Selected!"
      })
    }
    const ifCust = await Customer.findOne({ email: billing.email });
    if(ifCust){
      req.user = ifCust;
      next();
    } else {
      const user = new Customer({
        name: `${billing.firstName} ${billing.lastName}`,
        email: billing.email,
        phone: billing.phone,
        city: billing.city,
        country: billing.country,
        address: billing.address,
        guest: true
      })
      await user.save();
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error with Guest Checkout, please try again! Or Create an account."
    })
  }
}

const verifyGuestOrder = async(req, res, next) =>{
  try {
    const {id} = req.params;
    console.log(id)
    const order = await Order.findOne({ orderId: id });
    if(order){
      if(order.guestCheckout == true){
        next();
      } else {
        return res.status(401).json({
          error: "You are not authorized to View this Order!"
        })
      }
    } else {
      return res.status(404).json({
        error: "Order not found!"
      })
    }
  } catch(err){
    console.log(err)
    return res.status(401).json({
      error: "You are not authorized to View this Order!"
    })
  }
}


const isAdmin = async (req, res, next) => {
  const {authorization} = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const admin = await Admin.findOne({ role: "Admin", _id: req.user._id });
    if (admin) {
      next();
    } else {
      res.status(401).send({
        message: "User is not Admin",
      });
    }
  } catch (error) {
    return res.status(401).send({
      message: error.message,
    });
  }
  
};

module.exports = {
  signInToken,
  tokenForVerify,
  isAuth,
  isAdmin,
  guestAuth,
  verifyGuestOrder,
};
