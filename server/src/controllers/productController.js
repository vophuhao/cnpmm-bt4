// controllers/product.js
const { getProducts } = require("../services/product");

const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const filters = {
      category: req.query.category || null,
      search: req.query.search || null,
      priceMin: req.query.priceMin || null,   // ✅ đổi tên cho khớp
      priceMax: req.query.priceMax || null,   // ✅ đổi tên cho khớp
      promotion: req.query.promotion || null,
      sortBy: req.query.sortBy || null,
    };

    const { products, total } = await getProducts(page, limit, filters);

    return res.status(200).json({ data: products, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { getAllProduct };
