const History = require("../models/history.model");
const historyCtrl = {
  createHistory: async (
    transactionId,
    userId,
    ammount,
    balanceAfter,
    transactionType
  ) => {
    const history = new History({
      transactionId,
      userId,
      ammount,
      balanceAfter,
      transactionType,
    });
    try {
      await history.save();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
module.exports = historyCtrl;
