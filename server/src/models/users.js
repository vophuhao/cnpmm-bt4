const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  // Mảng lưu các sản phẩm yêu thích (ObjectId tham chiếu tới Product)
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // Mảng lưu các sản phẩm đã xem gần đây (ObjectId tham chiếu tới Product)
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
