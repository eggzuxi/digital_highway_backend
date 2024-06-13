const Mypage = require("../../models/myPage");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET
const bcrypt = require('bcrypt');

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
  const {userId, currentPassword, newPassword} = req.body;

  try{
    const user = await User.findOne({userID:userId});
    if(!user){
      return res.status(404).json({message:'User not found'});
    }
  
  //현재 비밀번호 확인
  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if(!isMatch){
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  
  // 새 비밀번호 해싱 및 업데이트
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
}catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
}

}

//@desc update phoneNum
//@route PUT /mypage/updatePhone
const updateTel = async(req,res)=>{
  const {userId, selectedCountry, phoneNumber} = req.body;
  try{
    const user = await User.findOne({userID:userId});
    if(!user){
      return res.status(404).json({message:'User not found'});
    }
    user.phoneNum = selectedCountry+") "+phoneNumber;
    await user.save();
    res.json({ message: 'Phone number updated successfully' });
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
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

// ID 찾기 함수 추가
const findUserId = async (req, res) => {
  const { userName, phoneNum } = req.body;
  try {
    console.log('Searching for user:', { userName, phoneNum });
    const user = await User.findOne({ userName, phoneNum });
    console.log('Query result:', user);
    if (user) {
      console.log('User found:', user);
      res.json({ userID: user.userID });
    } else {
      console.log('User not found');
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('Error during user search:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};



module.exports = {showUserPage, updatePw, updateTel, getMypage, findUserId}