const mongoose = require("mongoose");
require("dotenv/config");
const mailConfig = require("../config/mail");

exports.generateOTPCode = () => {
  const randomNumber = Math.random() * 10000;
  return randomNumber.toFixed();
};

exports.connectDB = (URI) => {
  mongoose.connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log("Connected to mongodb");
    }
  );
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


