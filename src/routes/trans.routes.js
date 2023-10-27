const router = require("express").Router();
const { transfer } = require("../controllers/transaction.controller");

router.post("/transfer", transfer);

module.exports = router;
