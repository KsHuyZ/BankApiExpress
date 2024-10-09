const Product = require("../models/products.model");

const productCtrl = {
  findAll: async (req, res) => {
    const products = await Product.find();
    return res.status(200).json({ products });
  },
  create: async (req, res) => {
    const data = req.body;
    console.log(data);
    const { name, type, price } = data;
    const product = new Product();
    await product.save();
    return res.status(200).json({ product });
  },
  update: async (req, res) => {
    const { name, type, price, id } = req.body;
    const product = await Product.findByIdAndUpdate(id, { name, type, price });
    await product.save();
    return res.status(200).json({ product });
  },
  deleteProduct: async (req, res) => {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  },
};
module.exports = productCtrl;
