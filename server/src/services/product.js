// services/product.js
const Product = require("../models/Product");

const getProducts = async (page, limit, filters) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    // Filter category
    if (filters.category) {
      query.category = filters.category;
    }

    // Filter search
    if (filters.search) {
      query.name = { $regex: filters.search, $options: "i" };
    }

    // Filter price range
    if (filters.priceMin != null || filters.priceMax != null) {
      query.price = {};
      if (filters.priceMin != null) query.price.$gte = Number(filters.priceMin);
      if (filters.priceMax != null) query.price.$lte = Number(filters.priceMax);
    }

    // Filter promotion
    // Nếu promotion === "on" thì lấy sản phẩm có giảm giá > 0
    if (filters.promotion === "on") {
      query.promotion = { $gt: 0 };
    }

    // Sort
    const sort = {};
    switch (filters.sortBy) {
      case "price_asc":
        sort.price = 1;
        break;
      case "price_desc":
        sort.price = -1;
        break;
      case "discount_desc":
        sort.promotion = -1;
        break;
      default:
        break;
    }

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sort),
      Product.countDocuments(query),
    ]);

    return { products, total };
  } catch (error) {
    console.error("Lỗi getProducts:", error);
    return { products: [], total: 0 };
  }
};

module.exports = { getProducts };
