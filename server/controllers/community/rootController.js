const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// @desc Show login
// @route Get /
const getLogin = (req, res) => {
  res.render("home");
};

// @desc Login user
// @route Post /
const postLogin = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  if (!user) {
    return res.send("존재하지 않는 아이디입니다.");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send("비밀번호가 틀렸습니다.");
  }

  const token = jwt.sign(
    { userId: user._id, userName: user.userName },
    jwtSecret
  );
  res.cookie("token", token, { httpOnly: true });

  return res.redirect("/community");
};

const getJoin = (req, res) => {
  res.status(200).render("join");
};

// @desc Join user
// @route Post /join
const postJoin = async (req, res) => {
  const { userName, password, password2 } = req.body;
  if (password !== password2) {
    return res.send("패스워드를 다시 확인해주세요.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ userName, password: hashedPassword });
  res.status(201).redirect("/");
};

// @desc Logout user
// @route Get /logout
const getLogout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

module.exports = { getLogin, postLogin, getJoin, postJoin, getLogout };
