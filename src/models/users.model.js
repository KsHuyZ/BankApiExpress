const { Schema, model } = require("mongoose");
const userModel = Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
    },
    phoneNumber: {
      type: String,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    otp: {
      type: {
        otpCode: Number,
        created_at: String,
      },
    },
    cardNumber: {
      type: Number,
      unique: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    token: {
      type: String,
    }
  },

  { timestamps: true }
);

module.exports = model("user", userModel);
