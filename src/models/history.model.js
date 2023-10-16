const { Schema, model } = require("mongoose");
const transactionSchema = Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    ammount: {
      type: Number,
      required: [true, "Please enter amount"],
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    // enum: received/sent
    transactionType: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = model("history", transactionSchema);
