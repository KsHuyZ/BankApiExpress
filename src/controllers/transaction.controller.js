const User = require("../models/users.model");
const Transaction = require("../models/transaction.model");
const { createHistory } = require("./history.controller");
const { transactionType } = require("../constant/index");
const mongoose = require("mongoose");
const { RECEIVED, SEND } = transactionType;

const transactionCtrl = {
  transfer: async (cardNumber, amount, message, fromUserId, socket, io) => {
    const session = await mongoose.startSession();
    if (!cardNumber || !amount || !fromUserId) throw new Error("set_all_field");
    try {
      await session.withTransaction(async () => {
        const fromUser = await User.findOne({ _id: fromUserId }).session(
          session
        );
        if (!fromUser) throw new Error("send_not_exist");
        const receivedUser = await User.findOne({ cardNumber }).session(
          session
        );
        if (!receivedUser) throw new Error("receiving_not_exist");
        if (fromUser.balance < amount) throw new Error("not_enough");
        fromUser.balance = fromUser.balance - amount;
        await fromUser.save();
        receivedUser.balance = receivedUser.balance + Number(amount);
        await receivedUser.save();
        const resultTrans = await transactionCtrl.createTransaction(
          fromUserId,
          receivedUser._id.toString(),
          amount,
          message
        );
        if (!resultTrans.success) throw new Error(resultTrans.message);
        const resultHis1 = await createHistory(
          resultTrans.id,
          fromUserId,
          amount,
          fromUser.balance,
          SEND
        );
        if (!resultHis1.success) throw new Error(resultHis1.message);
        const resultHis2 = await createHistory(
          resultTrans.id,
          receivedUser._id,
          amount,
          receivedUser.balance,
          RECEIVED
        );
        if (!resultHis2.success) throw new Error(resultHis1.message);
        socket.emit("update_balance", {
          newBalance: fromUser.balance,
          success: true,
          amount
        });
        io.to(receivedUser._id.toString()).emit(
          "receive_amount",
          receivedUser.balance
        );
      });
      return { success: true };
    } catch (error) {
      socket.emit("update_balance", {
        success: false,
      });
      console.log(error.message)
      return { success: false, message: error.message };
    } finally {
      session.endSession();
    }
  },
  createTransaction: async (fromUser, toUser, amount, message) => {
    console.log(fromUser, toUser, amount, message);
    try {
      const transaction = new Transaction({
        fromUser,
        toUser,
        amount,
        message,
      });
      await transaction.save();
      return { success: true, id: transaction._id };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
module.exports = transactionCtrl;
