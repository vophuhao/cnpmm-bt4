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

// export function
module.exports = {
  createUserService,loginService, getUserService
};