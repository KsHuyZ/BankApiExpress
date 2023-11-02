const { Schema, model } = require("mongoose");
const { transactionType } = require("../constant/index");

const { RECEIVED, SEND } = transactionType;

const transactionSchema = Schema(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "transaction",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: [RECEIVED, SEND],
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = model("history", transactionSchema);
