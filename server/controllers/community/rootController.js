const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// // @desc Show login
// // @route Get /
// const getLogin = (req, res) => {
//   res.render("home");
// };

// @desc Login user
// @route Post /
const postLogin = async (req, res) => {
  const { userID, password } = req.body;
  const user = await User.findOne({ userID });
  console.log(user)
  if (!user) {
    return res.status(400).send("존재하지않는 아이디입니다.");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).send("비밀번호가 틀렸습니다.");
  }

  const token = jwt.sign(
    { tokenId: user._id, userID: user.userID },
    jwtSecret
  );
  res.cookie("token", token, { httpOnly: true });
  res.status(200).json({message:"로그인성공"})
};

// const getJoin = (req, res) => {
//   res.status(200).render("join");
// };

// @desc Join user
// @route Post /join
const postJoin = async (req, res) => {
  const { userName, userID, password, password2, phoneNum } = req.body;

  // //react파일에서 패스워드 확인해서 주석처리했습니다.
  // if (password !== password2) {
  //   return res.send("패스워드를 다시 확인해주세요.");
  // }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ userName:userName, userID, password: hashedPassword, phoneNum:phoneNum});
  res.json(user)
};

// @desc Logout user
// @route Get /logout
const getLogout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

module.exports = { postLogin, postJoin, getLogout };
