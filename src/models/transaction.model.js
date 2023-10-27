const { Schema, model } = require("mongoose");
const transactionSchema = Schema(
  {
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter amount"],
    },
    message: {
      type: String,
    },
    time: {
      type:String,
      required: true,
    }
  },

  { timestamps: true }
);

module.exports = model("transaction", transactionSchema);
