const mongoose = require("mongoose");
require("dotenv/config");
const mailConfig = require("../config/mail");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

exports.generateOTPCode = () => {
  const randomNumber = Math.random() * 10000;
  return randomNumber.toFixed();
};

exports.connectDB = async (URI) => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

exports.sendMail = (to, subject, htmlContent, text) => {
  const transport = nodemailer.createTransport({
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    secure: false,
    auth: {
      user: mailConfig.USERNAME,
      pass: mailConfig.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: mailConfig.FROM_ADDRESS,
    to,
    subject,
    html: htmlContent,
    text,
  };
  return transport.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.handleTransaction = async (model, callback, req, res) => {
  const session = await model.startSession();
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
exports.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};
exports.generateToken = (user) => {
  const accessToken = jwt.sign(user, jwtSecret, { expiresIn: "3d" });
  const refreshToken = jwt.sign(user, jwtSecret);
  return accessToken;
};

exports.decodeTokenWithExp = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.log(`Error in decode access token: ${error}`);
    return null;
  }
};
