const asyncHandler = require("express-async-handler");
const health = require("../../models/healthModel");
const culture = require("../../models/cultureModel");
const career = require("../../models/careerModel");
const finance = require("../../models/financeModel");
const welfare = require("../../models/welfareModel");
const Mypage = require("../../models/myPage");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET

const getHealthPage = asyncHandler(async(req, res) => {
  const posts = await health.find();
  res.json(posts)
  // res.render("healthInfo", {posts:posts});
})

const getCulturePage = asyncHandler(async(req, res) => {
  const posts = await culture.find();
  res.json(posts)
  // res.render("culInfo", {posts:posts});
})

const getFinancePage = asyncHandler(async(req, res) => {
  const posts = await finance.find();
  res.json(posts)
  // res.render("finInfo", {posts:posts});
})

const getCareerPage = asyncHandler(async(req, res) => {
  const posts = await career.find();
  res.json(posts)
  // res.render("carInfo", {posts:posts});
})

const getWelfarePage = asyncHandler(async(req, res) => {
  const posts = await welfare.find();
  res.json(posts)
  // res.render("welInfo", {posts:posts});
})

const bookmark = asyncHandler(async(req,res)=>{
  const {postId, category} = req.body;
  const token = req.cookies.token;

  if (!token) {console.log("게스트모드")}

  let post;
  switch(category){
    case "문화":
      post = await culture.findById(postId);
      break;
    case "건강":
      post = await health.findById(postId);
      break;
    case "취업":
      post = await career.findById(postId);
      break;
    case "금융":
      post = await finance.findById(postId);
      break;
    case "복지":
      post = await welfare.findById(postId);
      break;
    default:
      return res.status(400).json({ message: "Invalid category" });
    }

    if (!post) {
      console.log(post)
      return res.status(404).json({ message: "Post not found" });
    }

  try{
    const {tokenId} = jwt.verify(token, jwtSecret);
    const mark = await Mypage.findOne({userID:tokenId})

    if (!mark) {
      return res.status(404).json({ message: "User not found" });
    }

    mark.bookmarks.push({
      category,
      title: post.title,
      link:post.link
    })

    await mark.save();
    res.status(200).json({message:"bookmark added successfully"})
  }catch(err){
    console.error(err);
    res.status(500).json({message:"internal server error"})
  }
  
});

module.exports = {getHealthPage, getCulturePage, getFinancePage, getCareerPage, getWelfarePage, bookmark};