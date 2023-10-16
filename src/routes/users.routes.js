const router = require("express").Router();
const { checkUser } = require("../controllers/users.controller");
/* GET users listing. */
router.get("/check-user", checkUser);

module.exports = router;
