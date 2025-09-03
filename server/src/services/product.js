// service/product.js
const Product = require("../models/product");

const getProducts = async (page, limit, category) => {
  try {
    const skip = (page - 1) * limit;

    let query = {};
    if (category) {
      query.category = category; // lọc theo danh mục
    }

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return { products, total };
  } catch (error) {
    console.log(error);
    return { products: [], total: 0 };
  }
};

module.exports = { getProducts };
