const router = require("express").Router();
const {
  checkUser,
  checkOTP,
  register,
  signIn,
  refreshOTP,
  refreshToken,
} = require("../controllers/auth.controller");

router.get("/check-user/:email", checkUser);
router.post("/check-otp", checkOTP);
router.post("/refresh-otp", refreshOTP);
router.post("/register", register);
router.post("/login", signIn);
router.post("/refresh-token", refreshToken)

module.exports = router;
