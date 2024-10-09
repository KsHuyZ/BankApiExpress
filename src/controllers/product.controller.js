const Product = require("../models/products.model");

const productCtrl = {
  findAll: async (req, res) => {
    const products = await Product.find();
    return res.status(200).json({ products });
  },
  findById: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.status(200).json({ product });
  },
  create: async (req, res) => {
    const data = req.body;
    const product = new Product(data);
    await product.save();
    return res.status(200).json({ product });
  },
  update: async (req, res) => {
    const { name, type, price, id } = req.body;
    const product = await Product.findByIdAndUpdate(id, { name, type, price });
    return res.status(200).json({ product });
  },
  deleteProduct: async (req, res) => {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  },
};
module.exports = productCtrl;
