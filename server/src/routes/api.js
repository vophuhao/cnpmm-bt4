const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  getFavoriteProducts,
  getRecentlyViewedProducts,
  checkProductLiked,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const {
  getAllProduct,
  getProductById,
  likeProduct,
  unlikeProduct,
  purchaseProduct,
} = require("../controllers/productController");

const routerAPI = express.Router();

// Test route cơ bản
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

// User routes
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);

// Product routes
routerAPI.get("/products", auth, getAllProduct); // lấy danh sách sản phẩm với filter, search, pagination
routerAPI.get("/products/:id", auth, getProductById); // lấy chi tiết sản phẩm và tăng views
routerAPI.post("/products/:id/like", auth, likeProduct); // tăng lượt thích
routerAPI.post("/products/:id/unlike", auth, unlikeProduct); // giảm lượt thích
routerAPI.post("/products/:id/purchase", auth, purchaseProduct); // tăng lượt mua
routerAPI.get("/user/favorites", auth, getFavoriteProducts);
routerAPI.get("/products/:id/liked", auth, checkProductLiked);
routerAPI.post("/products/:id/purchase", auth, purchaseProduct);
routerAPI.get("/user/viewed", auth, getRecentlyViewedProducts);

module.exports = routerAPI;
