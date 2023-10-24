const router = require("express").Router();
const {
  getUserNamebyCardNumber
} = require("../controllers/users.controller");
/* GET users listing. */
router.get("/card-number/:cardNumber", getUserNamebyCardNumber);

module.exports = router;
