const {createUserService, loginService, getUserService,getRecentlyViewedProductsService,
  checkProductLikedService,getFavoriteProductsService
} = require("../services/userServices");

// Đăng ký (Register)
const createUser = async (req, res) => {
  try {
    const {name, email, password} = req.body; 
    const user = await createUserService(name, email, password);

    return res.status(201).json({
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Đăng nhập (Login)
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);
    return res.status(200).json({
      message: "Login successful!",
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

// Lấy thông tin 1 user theo id
const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data)
}

// Lấy tất cả users
const getAccount = async (req, res) => {
  return res.status(200).json(req.user)
}
const getFavoriteProducts = async (req, res) => {
  try {
    const products = await getFavoriteProductsService(req.user.email);
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm đã xem
const getRecentlyViewedProducts = async (req, res) => {
  try {
    const products = await getRecentlyViewedProductsService(req.user.email);
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Kiểm tra sản phẩm đã thích
const checkProductLiked = async (req, res) => {
  try {
    const liked = await checkProductLikedService(req.user.email, req.params.id);
    return res.status(200).json({ liked });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Thích sản phẩm
const likeProduct = async (req, res) => {
  try {
    const product = await likeProductService(req.user.email, req.params.id);
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Bỏ thích sản phẩm
const unlikeProduct = async (req, res) => {
  try {
    const product = await unlikeProductService(req.user.email, req.params.id);
    return res.status(200).json({ message: "Đã bỏ thích sản phẩm", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Tăng lượt mua
const purchaseProduct = async (req, res) => {
  try {
    const product = await purchaseProductService(req.params.id);
    return res.status(200).json({ message: "Tăng lượt mua thành công", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  getFavoriteProducts,
  getRecentlyViewedProducts,
  checkProductLiked,
  likeProduct,
  unlikeProduct,
  purchaseProduct,
};
