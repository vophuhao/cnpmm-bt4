// controller/product.js
const { getProducts } = require("../services/product");

const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category || null;

    const { products, total } = await getProducts(page, limit, category);

    return res.status(200).json({ data: products, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { getAllProduct };
