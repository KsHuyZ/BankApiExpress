const router = require("express").Router();
const { getHistoryByUserIdLimit } = require("../controllers/history.controller");

router.get("/get-history/:id", getHistoryByUserIdLimit);
router.get("/get-history-limit/:id", getHistoryByUserIdLimit);

module.exports = router;
