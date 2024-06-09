const Mypage = require("../../models/myPage");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET

//@desc get my page
//@route Get /mypage
const showUserPage = async (req, res) => {
  const token = req.cookies.token;
  if (!token){
    return res.json(null);
  }
  try{const { tokenId } = jwt.verify(token, jwtSecret);
  const user = await User.findOne({ _id: tokenId });
  res.json(user);
  }catch{
    res.json(null)
  }
};

//@desc update pw
//@route PUT /mypage/updatePW
const updatePw = async (req,res)=>{
  const {updatedpw} = req.body;
  const token = req.cookies.token;
  const {tokenId} = jwt.verify(token, jwtSecret);
  const user = await User.findOne({_id:tokenId});
  user.password = updatedpw;
  user.save()
}

//@desc update phoneNum
//@route PUT /mypage/updatePhone
const updatePhone = async(req,res)=>{
  const {updatedphone} = req.body;
  const token = req.cookies.token;
  const {tokenId} = jwt.verify(token, jwtSecret);
  const user = await User.findOne({_id:tokenId});
  user.password = updatedphone;
  user.save()
}

const getMypage = async(req,res)=>{
  const token = req.cookies.token;
  if (!token){
    return res.json(null);
  }
  const {tokenId} = jwt.verify(token, jwtSecret);
  const mark = await Mypage.findOne({userID:tokenId});
  res.json(mark)
};

module.exports = {showUserPage, updatePw, updatePhone, getMypage}