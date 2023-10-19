const User = require("../models/users.model");
const {
  generateRandomNumber,
  sendMail,
  handleTransaction,
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/index");
const { otpForm } = require("../constant/index");
const userCtrl = {
  checkUser: async (req, res) => {
    const { email } = req.params;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        const otpCode = generateRandomNumber(4);
        const newUser = new User({
          email,
          otp: {
            otpCode,
            created_at: new Date(),
          },
        });
        newUser.save();
        sendMail(email, `Welcome to Bank App`, otpForm(otpCode));
        return res.status(200).json({ success: true, isVerified: false });
      }
      if (!user.isVerified) {
        const otpCode = generateRandomNumber(4);
        await User.findOneAndUpdate(
          { email },
          {
            otp: {
              otpCode,
              created_at: new Date(),
            },
          }
        );
        sendMail(email, `Welcome to Bank App`, otpForm(otpCode));
        return res.status(200).json({ success: true, isVerified: false });
      }
      if (!user.password) {
        return res
          .status(200)
          .json({ success: true, isVerified: true, password: false });
      }
      return res
        .status(200)
        .json({ success: true, isVerified: true, password: true });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  checkOTP: async (req, res) => {
    const { email, otp: otpClient } = req.body;
    try {
      const user = await User.findOne({ email });
      const currentTime = new Date();
      const otp = user.otp;
      const { otpCode, created_at: createdAt } = otp;
      if (otpClient !== otpCode) {
        throw new Error("wrong_otp");
      }
      if (new Date(currentTime) - new Date(createdAt) > 180000) {
        throw new Error("otp_expired");
      }
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  register: async (req, res) => {
    const { email, firstName, lastName, password, phoneNumber } = req.body;
    try {
      if (!firstName && !lastName && !password && !phoneNumber)
        throw new Error("Please enter all field");
      const user = await User.findOne({ email });
      if (!user) throw new Error("not_exist");
      if (!user.isVerified) throw new Error("not_verified");
      let cardNumber = null;
      while (!cardNumber) {
        const number = generateRandomNumber(16);
        const userCard = await User.findOne({ number });

        if (!userCard) {
          cardNumber = number;
        }
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.password = hashPassword(password);
      user.phoneNumber = phoneNumber;
      user.cardNumber = cardNumber;
      await user.save();
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  signIn: async (req, res) => {
    const { email, password: passwordClient } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("not_exist");
      }
      const hashPassword = user.password;
      const result = comparePassword(passwordClient, hashPassword);
      if (!result) throw new Error("wrong_password");
      const token = generateToken({ id: user._id });
      const newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
        balance: user.balance,
        phoneNumber: user.phoneNumber,
      };
      return res.status(200).json({ success: true, user: newUser, token });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  removeUser: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  showUserBelongToDepartment: async (req, res) => {
    const q = req.params.departmentId;
    try {
      const data = await User.find({
        idDepartment: q,
      });

      if (data) {
        return res.status(200).json({
          success: true,
          data,
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: "fails",
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  showUserNotDepartment: async (req, res) => {
    try {
      const users = await User.find();
      if (users) {
        const data = users.filter((item) => !item.idDepartment);
        return res.status(200).json(data);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  addUserDepartment: async (req, res) => {
    const idPerson = req.params.idPerson;
    const { idDepartment } = req.body;
    try {
      const updatedPost = await User.findOneAndUpdate(
        { _id: idPerson },
        {
          idDepartment,
        }
      );
      if (updatedPost) {
        res.status(200).json({ message: "Update successfully" });
      } else {
        console.log(updatedPost);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  removeUserBelongToDepartment: async (req, res) => {
    const id = req.params.deleteId;
    try {
      const updatedData = await User.findOneAndUpdate(
        { _id: id },
        {
          idDepartment: null,
        }
      );
      if (updatedData) {
        res.status(200).json({ message: "Update successfully" });
      } else {
        console.log(updatedData);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
  searchEmailHasDepartment: async (req, res) => {
    const departmentId = req.params.departmentId;
    try {
      const data = await User.find(
        {
          email: { $regex: req.params.q },
          departmentId: departmentId,
        },
        "email name avatar role gender address position"
      ).exec();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  searchEmailHasNotDepartment: async (req, res) => {
    try {
      try {
        const users = await User.find({ email: { $regex: req.params.q } });
        if (users) {
          const data = users.filter((item) => !item.idDepartment);
          return res.status(200).json(data);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  },
};

module.exports = userCtrl;
