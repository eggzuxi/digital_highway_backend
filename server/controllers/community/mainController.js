const multer = require("multer");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

// main -> community로 변경할 것
// @desc Show main page
// @route Get /main
const showMain = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.status(200).render("community", { posts });
};

// @desc See post
// @route Get /main/:id
const seePost = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments");
  post.views = post.views + 1;
  post.save();

  const token = req.cookies.token;
  const { userId } = jwt.verify(token, jwtSecret);
  res.status(200).render("post", { post, posts, userId });
};

// @desc Add comment
// @route Post /main/:id/addComment
const addComment = async (req, res) => {
  const postId = req.params.id;
  const token = req.cookies.token;
  const { userId } = jwt.verify(token, jwtSecret);
  const { commentContent } = req.body;
  const newComment = await Comment.create({
    commentContent,
    writer: userId,
    post: postId,
  });

  // 유저가 작성한 코멘트 배열에 추가
  const user = await User.findOne({ _id: userId });
  user.comments.unshift(newComment._id);
  await user.save();

  // 포스트의 코멘트 배열에 추가
  const post = await Post.findOne({ _id: postId });
  post.comments.unshift(newComment._id);
  await post.save();
  res.redirect(`/community/${postId}`);
};

const updateUps = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ _id: postId });
  post.ups = post.ups + 1;
  post.save();

  return res.status(201).redirect(`/community/${postId}`);
};

const updateDowns = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ _id: postId });
  post.save();
  post.downs = post.downs + 1;
  return res.status(201).redirect(`/community/${postId}`);
};

// @desc Get add post page
// @route Get /main/addPost
const getAddPost = async (req, res) => {
  return res.status(200).render("addPost");
};

// @desc Add post
// @route Post /main/addPost
const postAddPost = async (req, res) => {
  const { title, mainText } = req.body;
  const token = req.cookies.token;
  const { userId } = jwt.verify(token, jwtSecret);
  const { file } = req;
  let imageUrl;
  if (file) {
    const path = file.path;
    imageUrl = path.substr(6);
  }
  const newPost = await Post.create({
    title,
    mainText,
    writer: userId,
    imageUrl: file ? imageUrl : "",
  });

  const user = await User.findOne({ _id: userId });
  user.posts.unshift(newPost);
  user.save();
  res.status(201).redirect("/community");
};



// @desc Get update post page
// @route Get /main/:id/updatePost
const getUpdatePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ _id: postId });
  res.status(200).render("updatePost", { post });
};



// @desc Update post
// @route Put /main/:id/updatePost
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, mainText } = req.body;
  const { file } = req;
  let imageUrl;
  if (file) {
    const path = file.path;
    imageUrl = path.substr(6);
  }
  await Post.findByIdAndUpdate(postId, {
    title,
    mainText,
    imageUrl: file ? imageUrl : "",
  });
  res.status(201).redirect(`/community/${postId}`);
};

// @desc Delete post
// @route Delete /main/:id/deletedPost
const deletePost = async (req, res) => {
  const postId = req.params.id;
  await Post.findByIdAndDelete(postId);
  await Comment.deleteMany({ post: postId });
  res.status(201).redirect(`/community`);
};

// //@desc get my page
// //@route Get /mypage
// const showMyPage = async (req, res) => {
//   const token = req.cookies.token;
//   if (!token){
//     return res.json(null);
//   }
//   try{const { tokenId } = jwt.verify(token, jwtSecret);
//   const user = await User.findOne({ _id: tokenId });
//   res.json(user);
//   }catch{
//     res.json(null)
//   }
// };

// //@desc update pw
// //@route PUT /mypage/updatePW
// const updatePw = async (req,res)=>{
//   const {updatedpw} = req.body;
//   const token = req.cookies.token;
//   const {tokenId} = jwt.verify(token, jwtSecret);
//   const user = await User.findOne({_id:tokenId});
//   user.password = updatedpw;
//   user.save()
// }

// //@desc update phoneNum
// //@route PUT /mypage/updatePhone
// const updatePhone = async(req,res)=>{
//   const {updatedphone} = req.body;
//   const token = req.cookies.token;
//   const {tokenId} = jwt.verify(token, jwtSecret);
//   const user = await User.findOne({_id:tokenId});
//   user.password = updatedphone;
//   user.save()
// }

module.exports = {
  showMain,
  seePost,
  addComment,
  updateUps,
  updateDowns,
  getAddPost,
  postAddPost,
  getUpdatePost,
  updatePost,
  deletePost,
};
