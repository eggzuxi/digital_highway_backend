const User = require("../../models/User");
const Mypage = require("../../models/myPage")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

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

// @desc Join user
// @route Post /join
const postJoin = async (req, res) => {
  const { userName, userID, password, password2, phoneNum } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ userName:userName, userID:userID, password: hashedPassword, phoneNum:phoneNum});
  await Mypage.create({userID: user._id, myPost:[], myComments:[], bookmarks:[]});
  res.status(200).json(user)
};

// @desc Logout user
// @route Post /logout
const postLogout = async (req, res) => {
  try{
    res.clearCookie('token',{path:'/', domain: 'localhost', secure:false, httpOnly:true});
    res.status(200).json({success:true, message:'로그아웃 완료'});
  }catch(err){
    console.error('로그아웃오류',err);
    res.status(500).json({message:'로그아웃 중 오류발생'})
  }  
};

module.exports = { postLogin, postJoin, postLogout };
