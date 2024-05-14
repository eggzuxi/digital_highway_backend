require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const notifier = require("node-notifier");

const checkNotLogin = async (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  const token = req.cookies.token;
  if (token) {
    notifier.notify({
      title: "스마트부산갤러리",
      message: "먼저 로그아웃을 해주세요.",
    });
    return res.redirect("/main");
  }
  next();
};

module.exports = checkNotLogin;
