// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
});

module.exports = mongoose.model("Product", ProductSchema);
