const {createUserService, loginService, getUserService} = require("../services/userServices");

// Đăng ký (Register)
const createUser = async (req, res) => {
  try {
    const {name, email, password} = req.body; 
    const user = await createUserService(name, email, password);

    return res.status(201).json({
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Đăng nhập (Login)
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);
    return res.status(200).json({
      message: "Login successful!",
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

// Lấy thông tin 1 user theo id
const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data)
}

// Lấy tất cả users
const getAccount = async (req, res) => {
  return res.status(200).json(req.user)
}

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
};
