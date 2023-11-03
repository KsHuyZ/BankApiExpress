const router = require("express").Router();
const {
  getUserNamebyCardNumber,
  updateProfile,
  changePassword,
} = require("../controllers/users.controller");

router.get("/card-number/:cardNumber", getUserNamebyCardNumber);
router.put("/update-profile", updateProfile);
router.put("/change-password", changePassword);

module.exports = router;
