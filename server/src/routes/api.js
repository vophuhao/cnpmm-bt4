const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const { getAllProduct } = require("../controllers/productController");


const routerAPI = express.Router();
//routerAPI.all("*", auth);
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.get("/products",getAllProduct)

// Route cần bảo vệ - thêm middleware auth
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);
module.exports = routerAPI; //export default
