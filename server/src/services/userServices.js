require("dotenv").config();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({email});
    if(user){
      console.log(`User exits , chon 1 mail khac: ${email}`);
      return null;
    }
    //hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds)
    //save user to database
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "User"
    })
    return result;

   
  } catch (error) {
    console.log(error);
    return null;
  }
};
const loginService = async (email1, password) => {
  try{
    const user = await User.findOne({email: email1});
    if(user){
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if(!isMatchPassword){
        return{
          EC: 2,
          EM: "Email/Password không hợp lệ"
        }
      } else{
        const payload = {
          email: user.email,
          name: user.name
        }
        const access_token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRE
          }
        )
        return{
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name
          }
        };
      }
    }else{
      return{
        EC: 1,
        EM: "Email/Password không hợp lệ"
      }
    }
  }catch (error){
    console.log(error);
    return null;
  }
}

const getUserService = async () => {
  try{
    let result = await User.find({}).select("-password");
    return result;
  }catch(error){
    console.log(error);
    return null;
  }
}
const getFavoriteProductsService = async (userEmail) => {
  const user = await User.findOne({ email: userEmail }).populate("favorites");
  return user ? user.favorites : [];
};

// Lấy sản phẩm đã xem của user
const getRecentlyViewedProductsService = async (userEmail) => {
  const user = await User.findOne({ email: userEmail }).populate("recentlyViewed");
  return user ? user.recentlyViewed : [];
};

// Kiểm tra sản phẩm đã được thích
const checkProductLikedService = async (userEmail, productId) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) return false;

  // Chú ý: favorites là mảng ObjectId nên cần so sánh chuỗi
  return user.favorites.some(fav => fav.toString() === productId.toString());
};


// Thích sản phẩm
const likeProductService = async (userEmail, productId) => {
  const user = await User.findOne({ email: userEmail });
  const product = await Product.findById(productId);
  if (!user || !product) throw new Error("User hoặc Product không tồn tại");

  if (!user.favoriteProducts.includes(productId)) {
    user.favoriteProducts.push(productId);
    product.likes += 1;
    product.likedUsers.push(user._id);
    await user.save();
    await product.save();
  }
  return product;
};

// Bỏ thích sản phẩm
const unlikeProductService = async (userEmail, productId) => {
  const user = await User.findOne({ email: userEmail });
  const product = await Product.findById(productId);
  if (!user || !product) throw new Error("User hoặc Product không tồn tại");

  user.favoriteProducts = user.favoriteProducts.filter((p) => p.toString() !== productId);
  product.likes = Math.max(product.likes - 1, 0);
  product.likedUsers = product.likedUsers.filter((u) => u.toString() !== user._id.toString());

  await user.save();
  await product.save();
  return product;
};

// Tăng lượt xem


// Tăng lượt mua
const purchaseProductService = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product không tồn tại");
  product.purchases += 1;
  await product.save();
  return product;
};

// export function
module.exports = {
  createUserService,loginService, getUserService, getFavoriteProductsService,
  getRecentlyViewedProductsService,
  checkProductLikedService,
  likeProductService,
  unlikeProductService,
  purchaseProductService,
};