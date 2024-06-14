const Mypage = require("../../models/myPage");
const User = require("../../models/User");
const Post = require("../../models/Post")
const Comment = require("../../models/Comment")
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

const getMypage = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(null);
  }
  
  try {
    const { tokenId } = jwt.verify(token, jwtSecret);
    
    // 사용자의 마이페이지 정보 조회
    const mark = await Mypage.findOne({ userID: tokenId });
    const posts = await Post.find({ writer: tokenId });
    let comments = await Comment.find({ writer: tokenId });
    
    // comments 안의 각 comment에 대해 post 필드 값으로 Post 문서 찾기
    comments = await Promise.all(comments.map(async (comment) => {
      const post = await Post.findById(comment.post);
      const commentObject = comment.toObject();
      if (post) {
        commentObject.postTitle = post.title; // 임시로 postTitle 필드 추가
      }
      return commentObject;
    }));
    console.log(comments)
    // 응답으로 보낼 데이터 객체 생성
    const responseData = {
      mark: mark,
      posts: posts,
      comments: comments
    };
    // 응답 전송
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {showUserPage, updatePw, updateTel, getMypage}