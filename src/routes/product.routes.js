const router = require("express").Router();
const {
  create,
  update,
  deleteProduct,
  findAll,
  findById,
} = require("../controllers/product.controller");

router.get("/", findAll);
router.get("/:id", findById);
router.post("/", create);
router.put("/", update);
router.delete("/:id", deleteProduct);

module.exports = router;
