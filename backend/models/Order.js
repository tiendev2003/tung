const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const shortid = require("shortid");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoice: {
      type: Number,
      required: false,
    },
    cart: [{}],
    orderId: {
      type: String,
      required: true,
      default: "ORD-" + shortid.generate(),
    },
    user_info: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancel", "Return"],
    },
    guestCheckout: {
      type: Boolean,
      required: true,
      default: false,
    },
    awb: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    paymentStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    shipmentDetails: {
      length: {
        type: String,
        required: false,
      },
      height: {
        type: String,
        required: false,
      },
      breadth: {
        type: String,
        required: false,
      },
      weight: {
        type: String,
        required: false,
      },
    },
    paymentInfoDetails: {
      payment_id: String,
      payment_gateway: String,
      payment_status: String,
      payment_response: String,
    },
    courierDetails: {
      shipping_id: String,
      awb_number: String,
      courier_id: String,
      courier_name: String,
      label: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema.plugin(AutoIncrement, {
    inc_field: "invoice",
    start_seq: 10000,
  })
);
module.exports = Order;
