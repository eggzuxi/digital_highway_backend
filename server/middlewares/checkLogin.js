require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const notifier = require("node-notifier");

const checkLogin = async (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  const token = req.cookies.token;
  if (!token) {
    notifier.notify({
      title: "스마트부산갤러리",
      message: "로그인이 필요한 서비스입니다.",
    });
    return res.redirect("/");
  }
  next();
};

module.exports = checkLogin;
