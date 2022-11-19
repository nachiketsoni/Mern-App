const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Please enter your address"],
    },
    city: {
      type: String,
      required: [true, "Please enter your city"],
    },
    state: {
      type: String,
      required: [true, "Please enter your State"],
    },

    phoneNo: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    pinCode: {
      type: String,
      required: [true, "Please enter your postal code"],
    },
    country: {
      type: String,
      required: [true, "Please enter your country"],
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      name: {
        type: String,

        required: [true, "Please enter product name"],
      },
      quantity: {
        type: Number,

        required: [true, "Please enter product quantity"],
      },
      image: {
        type: String,

        required: [true, "Please enter product image"],
      },
      price: {
        type: Number,

        required: [true, "Please enter product price"],
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
      required: [true, "Please enter your payment id"],
    },
    status: {
      type: String,
      required: [true, "Please enter your payment status"],
    },
  },
  paidAt: {
    type: Date,
    required: [true, "Please enter your payment date"],
  },
  itemsPrice: {
    type: Number,
    required: [true, "Please enter items price"],
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: [true, "Please enter tax price"],
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: [true, "Please enter shipping price"],
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: [true, "Please enter total price"],
    default: 0,

  },
  orderStatus: {
    type: String,
    required: [true, "Please enter order status"],
    default: "Processing",
  },
  deliveredAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Order", orderSchema);
