const User = require("../models/users.model");
const { comparePassword, hashPassword } = require("../utils/index");
const userCtrl = {
  getUserNamebyCardNumber: async (req, res) => {
    const { cardNumber } = req.params;
    try {
      const user = await User.findOne({ cardNumber });
      if (!user) throw new Error("not_exist");
      return res
        .status(200)
        .json({ success: true, name: `${user.firstName} ${user.lastName}` });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  updateProfile: async (req, res) => {
    const { firstName, lastName, phoneNumber, _id } = req.body;
    try {
      if (!firstName || !lastName || !phoneNumber)
        throw new Error("set_all_field");
      await User.findOneAndUpdate(
        { _id },
        { firstName, lastName, phoneNumber }
      );
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  changePassword: async (req, res) => {
    const { _id, oldPassword, newPassword, retypePassword } = req.body;
    try {
      if (!oldPassword || !newPassword || !retypePassword)
        throw new Error("set_all_field");
      if (newPassword !== retypePassword) throw new Error("not_same");
      const user = await User.findOne({ _id });
      if (!comparePassword(oldPassword, user.password))
        throw new Error("wrong_password");
      user.password = hashPassword(newPassword);
      await user.save();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};

module.exports = userCtrl;
