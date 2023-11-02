const router = require("express").Router();
const {
  getHistoryByUserIdLimit,
  getHistoryByUserId,
} = require("../controllers/history.controller");

router.get("/get-history/:id", getHistoryByUserId);
router.get("/get-history-limit/:id", getHistoryByUserIdLimit);

module.exports = router;
