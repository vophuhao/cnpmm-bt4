const FuzzySearch = require("fuzzy-search");
const Product = require("../models/Product");
const User = require("../models/users");
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

// Lấy sản phẩm theo filter, search, phân trang
const getProducts = async (page, limit, filters) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    // Filter category
    if (filters.category) query.category = filters.category;

    // Filter price range
    if (filters.priceMin != null || filters.priceMax != null) {
      query.price = {};
      if (filters.priceMin != null) query.price.$gte = Number(filters.priceMin);
      if (filters.priceMax != null) query.price.$lte = Number(filters.priceMax);
    }

    // Filter promotion
    if (filters.promotion === "on") query.promotion = { $gt: 0 };

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
      case "views_desc":
        sort.views = -1;
        break;
      case "favorites_desc":
        sort.favorites = -1;
        break;
      case "purchases_desc":
        sort.purchases = -1;
        break;
      default:
        break;
    }

    // Lấy tất cả sản phẩm theo filter (chưa search)
    let products = await Product.find(query).sort(sort);
    let total = products.length;

    // Fuzzy search (không dấu)
    if (filters.search) {
      const keyword = removeVietnameseTones(filters.search);

      // Tạo mảng products có thêm field nameNoAccent để search
      const productsWithNoAccent = products.map((p) => ({
        ...p._doc,
        nameNoAccent: removeVietnameseTones(p.name),
      }));

      const searcher = new FuzzySearch(productsWithNoAccent, ["nameNoAccent"], {
        caseSensitive: false,
        sort: true,
      });

      const results = searcher.search(keyword);
      products = results;
      total = results.length;
    }

    // Pagination sau fuzzy
    products = products.slice(skip, skip + limit);

    return { products, total };
  } catch (error) {
    console.error("Lỗi getProducts:", error);
    return { products: [], total: 0 };
  }
};

// Tăng lượt xem khi người dùng truy cập chi tiết sản phẩm
const incrementViews = async (userEmail, productId) => {
  console.log(userEmail)
  try {
    const product = await Product.findById(productId);
    const user = userEmail ? await User.findOne({ email: userEmail }) : null;

    if (!product) throw new Error("Sản phẩm không tồn tại");

    // Nếu có user và user chưa xem sản phẩm
    if (user && !user.recentlyViewed.includes(productId)) {
      user.recentlyViewed.push(productId);      // Lưu sản phẩm vào recentlyViewed của user
      product.viewedUsers.push(user._id);       // Lưu user vào viewedUsers của product
      product.views += 1;                        // Tăng views 1 lần
      await user.save();
      await product.save();
    } 
    // Nếu không có user hoặc user đã xem sản phẩm rồi thì chỉ tăng views
    else if (!user) {
      product.views += 1;
      await product.save();
    }

    return product;
  } catch (error) {
    console.error("Lỗi incrementViews:", error);
    return null;
  }
};


// Tăng lượt yêu thích
const toggleLikeProduct = async (productId, userEmail) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  // tìm user theo email
  const user = await User.findOne({ email: userEmail });
  if (!user) return null;

  let liked = false;

  if (product.likedUsers.includes(user._id)) {
    // bỏ like
    product.likedUsers.pull(user._id);
    product.favorites = product.favorites > 0 ? product.favorites - 1 : 0;
    await User.findByIdAndUpdate(user._id, { $pull: { favorites: productId } });
  } else {
    // thêm like
    product.likedUsers.push(user._id);
    product.favorites += 1;
    await User.findByIdAndUpdate(user._id, { $addToSet: { favorites: productId } });
    liked = true;
  }

  await product.save();
  return { product, liked };
};

// Giảm lượt yêu thích
const decrementFavorites = async (productId) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { favorites: -1 } },
      { new: true }
    );
    return product;
  } catch (error) {
    console.error("Lỗi decrementFavorites:", error);
    return null;
  }
};

// Tăng lượt mua khi khách đặt hàng thành công
const incrementPurchases = async (productId, quantity = 1) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { purchases: quantity } },
      { new: true }
    );
    return product;
  } catch (error) {
    console.error("Lỗi incrementPurchases:", error);
    return null;
  }
};

module.exports = {
  getProducts,
  incrementViews,
  toggleLikeProduct,
  decrementFavorites,
  incrementPurchases,
};
