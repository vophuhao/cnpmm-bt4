// controllers/product.js
const {
  getProducts,
  incrementViews,
  toggleLikeProduct,
  decrementFavorites,
  incrementPurchases,
} = require("../services/product");

// Lấy danh sách sản phẩm với filter, search, phân trang
const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const filters = {
      category: req.query.category || null,
      search: req.query.search || null,
      priceMin: req.query.priceMin || null,
      priceMax: req.query.priceMax || null,
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

// Lấy chi tiết sản phẩm theo ID và tăng lượt xem
const getProductById = async (req, res) => {
  try {
    const  id  = req.params.id;
    const product = await incrementViews(req.user.email,id);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    return res.status(200).json({product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};


const likeProduct = async (req, res) => {
  try {
    
    const result = await toggleLikeProduct(req.params.id, req.user.email);
    if (!result) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    return res.status(200).json({ data: result.product, liked: result.liked });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};


// Giảm lượt thích
const unlikeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await decrementFavorites(id);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    return res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Tăng lượt mua (số lượng mua có thể truyền qua body)
const purchaseProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const quantity =  1;
    const product = await incrementPurchases(id, quantity);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    return res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};


module.exports = {
  getAllProduct,
  getProductById,
  likeProduct,
  unlikeProduct,
  purchaseProduct,
};
