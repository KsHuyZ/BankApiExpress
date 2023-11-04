const { otpForm } = require("../constant/index");
const User = require("../models/users.model");
const {
  generateRandomNumber,
  sendMail,
  handleTransaction,
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/index");
const authCtrl = {
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
      const newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        balance: user.balance,
        cardNumber: user.cardNumber,
      };
      return res.status(200).json({
        success: true,
        isVerified: true,
        password: true,
        user: newUser,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  checkOTP: async (req, res) => {
    const { email, otp: otpClient } = req.body;
    console.log(email, otpClient);
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("not_exist");
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
      console.log(error.message);
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
      let cardNumber;
      while (!cardNumber) {
        const number = generateRandomNumber(16);
        const userCard = await User.findOne({ cardNumber: number });
        if (!userCard) {
          cardNumber = number;
          break;
        }
        continue;
      }
      const accessToken = generateAccessToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id });
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = hashPassword(password);
      user.phoneNumber = phoneNumber;
      user.cardNumber = cardNumber;
      user.token = refreshToken;
      const newUser = {
        firstName,
        lastName,
        _id: user._id,
        phoneNumber,
        email,
        cardNumber,
        balance: 0,
      };
      await user.save();
      return res
        .status(200)
        .json({ success: true, user: newUser, accessToken, refreshToken });
    } catch (error) {
      console.log(error.message);
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
      const accessToken = generateAccessToken({ id: user._id });
      const newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        cardNumber: user.cardNumber,
        balance: user.balance,
      };
      return res.status(200).json({
        success: true,
        user: newUser,
        accessToken,
        refreshToken: user.token,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  refreshOTP: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("not_exist");
      const otpCode = generateRandomNumber(4);
      user.otp = {
        otpCode,
        created_at: new Date(),
      };
      await user.save();
      sendMail(email, `Welcome to Bank App`, otpForm(otpCode));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  refreshToken: async (req, res) => {
    const { refreshToken, email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("not_exist");
      if (user.token !== refreshToken) throw new Error("wrong_token");
      const accessToken = generateAccessToken({ id: user._id });
      return res.status(200).json({ success: true, accessToken });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};
module.exports = authCtrl;
