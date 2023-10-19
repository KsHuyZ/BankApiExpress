const router = require("express").Router();
const {
  checkUser,
  checkOTP,
  register,
  signIn,
} = require("../controllers/users.controller");
/* GET users listing. */
router.get("/check-user/:email", checkUser);
router.post("/check-otp", checkOTP);
router.post("/register", register);
router.post("/login", signIn);
module.exports = router;
