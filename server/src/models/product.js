// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  category: String,
  price: { type: Number, required: true },
  promotion: { type: Number, default: 0 }, // %
});

module.exports = mongoose.model("Product", ProductSchema);
