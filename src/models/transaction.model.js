const { Schema, model } = require("mongoose");
const transactionSchema = Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    ammount: {
      type: Number,
      required: [true, "Please enter amount"],
    },
    message: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = model("transaction", transactionSchema);
