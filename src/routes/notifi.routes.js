const router = require("express").Router();
const {
  countNotifi,
  getNotifcationByUserId,
  seenNotification
} = require("../controllers/notification.controller");

router.get("/count-noti/:id", countNotifi);
router.get("/get-notifi/:id", getNotifcationByUserId);
router.get("/seen-notifi/:id", seenNotification);
module.exports = router;
