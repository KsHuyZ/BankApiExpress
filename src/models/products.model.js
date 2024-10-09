const { Schema, model } = require("mongoose");

const productSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = model("product", productSchema);
