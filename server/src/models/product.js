// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  category: String,
  price: { type: Number, required: true },
  promotion: { type: Number, default: 0 }, // %
  description: { type: String }, // Mô tả sản phẩm
  views: { type: Number, default: 0 }, // Lượt xem
  commentsCount: { type: Number, default: 0 }, // Lượt bình luận
  purchases: { type: Number, default: 0 }, // Lượt mua
  favorites: { type: Number, default: 0 },
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  viewedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Lượt yêu thích
}, { timestamps: true }); // timestamps tạo createdAt và updatedAt

module.exports = mongoose.model("Product", ProductSchema);


