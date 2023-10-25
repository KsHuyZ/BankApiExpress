const User = require("../models/users.model");
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
};

module.exports = userCtrl;
