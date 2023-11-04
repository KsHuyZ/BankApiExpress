const User = require("../models/users.model");
const Transaction = require("../models/transaction.model");
const { createHistory } = require("./history.controller");
const { transactionType } = require("../constant/index");
const mongoose = require("mongoose");
const { getCurrentTime } = require("../utils");
const { createNotifi } = require("./notification.controller");
const { getUser } = require("../data/user.socket");
require("dayjs/locale/vi");
const { RECEIVED, SEND } = transactionType;

const transactionCtrl = {
  transfer: async (cardNumber, amount, message, fromUserId, socket, io) => {
    const session = await mongoose.startSession();
    if (!cardNumber || !amount || !fromUserId) throw new Error("set_all_field");
    if (amount <= 0) throw new Error("amount_bigger");
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
        const time = getCurrentTime();
        const resultTrans = await transactionCtrl.createTransaction(
          fromUserId,
          receivedUser._id.toString(),
          amount,
          message,
          time
        );
        if (!resultTrans.success) throw new Error(resultTrans.message);
        console.log(resultTrans);
        const resultHis1 = await createHistory(
          resultTrans.id,
          fromUserId,
          fromUser.balance,
          SEND,
          time
        );
        console.log(resultHis1);
        const resultNoti1 = await createNotifi(
          resultHis1.history._id.toString(),
          fromUserId
        );
        console.log(resultNoti1);
        if (!resultNoti1.success) throw new Error(resultNoti1.message);
        if (!resultHis1.success) throw new Error(resultHis1.message);
        const resultHis2 = await createHistory(
          resultTrans.id,
          receivedUser._id,
          receivedUser.balance,
          RECEIVED,
          time
        );
        console.log(resultHis2);
        const resultNoti2 = await createNotifi(
          resultHis2.history._id.toString(),
          receivedUser._id.toString()
        );
        console.log(resultHis2);
        if (!resultNoti2.success) throw new Error(resultNoti2.message);
        if (!resultHis2.success) throw new Error(resultHis2.message);
        socket.emit("update_balance", {
          newBalance: fromUser.balance,
          toUser: `${receivedUser.firstName} ${receivedUser.lastName}`,
          success: true,
          amount,
          time,
        });
        socket.emit("new_noti", resultNoti1.notification);
        const user = getUser(receivedUser._id.toString());
        if(user) {
          io.to(user.id).emit("receive_amount", {
            newBalance: receivedUser.balance,
            newHistory: resultHis2.history,
            fromUser: `${fromUser.firstName} ${fromUser.lastName}`,
            amount,
          });
          io.to(user.id).emit("new_noti", resultNoti2.notification);
        }
      });
      return { success: true };
    } catch (error) {
      socket.emit("update_balance", {
        success: false,
      });
      console.log(error.message);
      return { success: false, message: error.message };
    } finally {
      session.endSession();
    }
  },
  createTransaction: async (fromUser, toUser, amount, message, time) => {
    console.log(fromUser, toUser, amount, message);
    try {
      const transaction = new Transaction({
        fromUser,
        toUser,
        amount,
        message,
        time,
      });
      await transaction.save();
      return { success: true, id: transaction._id };
    } catch (error) {
      console.log(error.message);
      return { success: false, message: error.message };
    }
  },
};
module.exports = transactionCtrl;
