const History = require("../models/history.model");
const historyCtrl = {
  createHistory: async (
    transactionId,
    userId,
    balanceAfter,
    transactionType,
    time
  ) => {
    const history = new History({
      transactionId,
      userId,
      balanceAfter,
      transactionType,
      time,
    });
    try {
      await history.save();
      return { success: true, history };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getHistoryByUserIdLimit: async (req, res) => {
    const { id } = req.params;
    const histories = await History.find({ userId: id }).populate("transactionId")
      .sort({ _id: -1 })
      .limit(3);
    return res.status(200).json({ success: true, histories });
  },
  getHistoryByUserId: async (req, res) => {
    const { id } = req.params;
    const histories = await History.find({ userId: id }).sort({ _id: -1 }).populate("transactionId");
    return res.status(200).json({ success: true, histories });
  },
};
module.exports = historyCtrl;
