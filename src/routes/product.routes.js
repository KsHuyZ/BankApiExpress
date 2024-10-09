const router = require("express").Router();
const {
create, update, deleteProduct, findAll
} = require("../controllers/product.controller");

router.get("/", findAll);
router.post("/", create);
router.put("/", update);
router.delete("/", deleteProduct);

module.exports = router;
