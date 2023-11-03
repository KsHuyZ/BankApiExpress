const Notifi = require("../models/notification.model");
const notiCtrl = {
  createNotifi: async (historyId, userId) => {
    console.log("Hehehe");
    const notification = new Notifi({
      historyId,
      userId,
    });
    try {
      await notification.save();
      console.log("noti: ", notification);
      const notifi = await Notifi.findById(
        notification._id.toString()
      ).populate({
        path: "historyId",
        populate: {
          path: "transactionId",
          populate: {
            path: "toUser fromUser",
          },
        },
      });

      return { success: true, notification: notifi };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  countNotifi: async (req, res) => {
    const { id } = req.params;
    const count = await Notifi.countDocuments({ seen: false, userId: id });
    return res.status(200).json({ count });
  },
  getNotifcationByUserId: async (req, res) => {
    const { id } = req.params;
    const notifications = await Notifi.find({ userId: id }).populate({
      path: "historyId",
      populate: {
        path: "transactionId",
        populate: {
          path: "toUser fromUser",
        },
      },
    });
    return res.status(200).json({ notifications });
  },
  seenNotification: async (req, res) => {
    const { id } = req.params;
   try {
    await Notifi.findOneAndUpdate({_id:id}, { seen: true });
    return res.status(200).json({ success: true });
   } catch (error) {
    console.log(error.message)
   }

  },
};
module.exports = notiCtrl;
