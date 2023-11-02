const { Schema, model } = require("mongoose");

const notificationSchema = Schema(
  {
    historyId: {
      type: Schema.Types.ObjectId,
      ref: "history",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = model("notification", notificationSchema);
