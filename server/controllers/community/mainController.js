const multer = require("multer");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User")

// @desc Show main page
// @route Get /main
const showCommunity = async (req, res) => {
  try {
    const type = req.query.type;
    let posts
    //params의 type값이 hot이면 인기게시물 순으로, 아니면 최신게시물 순으로 포스트 불러옴
    if (type == "hot"){
      posts = await Post.find({}).sort({ views: -1 });
    }else{
      posts = await Post.find({}).sort({ createdAt: -1 });
    }
    
    // 작성자에 유저아이디 뜨게 하기
    const postsWithWriterInfo = await Promise.all(posts.map(async (post) => {
      const user = await User.findById(post.writer);
      if (user) {
        return { ...post.toObject(), writerName: user.userID };
      } else {
        return { ...post.toObject(), writerName: "Unknown" };
      }
    }));
    res.status(200).json(postsWithWriterInfo)
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc See post
// @route GET /main/:id
const seePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the specific post by ID
    const post = await Post.findById(id)
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Fetch comments associated with the post
    const comments = await Comment.find({ post: id });

    // Add writerName to each comment
    const commentsWithWriterInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.writer);
        if (user) {
          return { ...comment, writerName: user.userID };
        } else {
          return { ...comment, writerName: "Unknown" };
        }
      })
    );

    

    // Find the user associated with the post writer ID
    const user = await User.findById(post.writer);
    if (!user) {
      post.writerName = "Unknown";
    } else {
      post.writerName = user.userID;
    }

    // 조회수 올라감
    post.views += 1;
    await post.save();

    // // Verify the JWT token from cookies
    // const token = req.cookies.token;
    // const { userId } = jwt.verify(token, jwtSecret);

    // Return the post data as JSON
    res.status(200).json({post, writerName:post.writerName, comments:commentsWithWriterInfo});
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Add comment
// @route Post /main/:id/addComment
const addComment = async (req, res) => {
  const postId = req.params.id;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecret);
  const userId = decoded.tokenId;

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
  res.status(200).json({post, user})
};

// const updateUps = async (req, res) => {
//   const postId = req.params.id;
//   const post = await Post.findOne({ _id: postId });
//   post.ups = post.ups + 1;
//   post.save();

//   return res.status(201).redirect(`/community/${postId}`);
// };

// const updateDowns = async (req, res) => {
//   const postId = req.params.id;
//   const post = await Post.findOne({ _id: postId });
//   post.save();
//   post.downs = post.downs + 1;
//   return res.status(201).redirect(`/community/${postId}`);
// };

// // @desc Get add post page
// // @route Get /main/addPost
// const getAddPost = async (req, res) => {
//   return res.status(200).render("addPost");
// };

const postAddPost = async (req, res) => {
  try {
    const { title, mainText, tags } = req.body;
    console.log("요청 본문:", req.body);

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "인증 토큰이 없습니다." });
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log("디코딩된 토큰:", decoded);

    const userId = decoded.tokenId
    console.log("디코딩된 사용자 ID:", userId);

    if (!userId) {
      return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
    }

    const { file } = req;

    let imageUrl = "";
    if (file) {
      const path = file.path;
      imageUrl = path.substr(6);
    }

    const newPost = await Post.create({
      title,
      mainText,
      writer: userId,
      imageUrl,
      // tags, // 태그 추가
    });
    console.log("새 포스트 생성:", newPost);

    const user = await User.findOne({ _id: userId });
    user.posts.unshift(newPost);
    await user.save();

    res.status(201).json({ message: "포스트 생성 완료" });
  } catch (err) {
    console.error("포스트 생성 중 오류가 발생했습니다:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// // @desc Get update post page
// // @route Get /main/:id/updatePost
// const getUpdatePost = async (req, res) => {
//   const postId = req.params.id;
//   const post = await Post.findOne({ _id: postId });
//   res.status(200).render("updatePost", { post });
// };



// // @desc Update post
// // @route Put /main/:id/updatePost
// const updatePost = async (req, res) => {
//   const postId = req.params.id;
//   const { title, mainText } = req.body;
//   const { file } = req;
//   let imageUrl;
//   if (file) {
//     const path = file.path;
//     imageUrl = path.substr(6);
//   }
//   await Post.findByIdAndUpdate(postId, {
//     title,
//     mainText,
//     imageUrl: file ? imageUrl : "",
//   });
//   res.status(201).redirect(`/community/${postId}`);
// };

// @desc Delete post
// @route Delete /main/:id/deletedPost
const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    // 댓글 삭제
    await Comment.deleteMany({ post: postId });
    // 포스트 삭제
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
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
  showCommunity,
  seePost,
  addComment,
  // updateUps,
  // updateDowns,
  // getAddPost,
  postAddPost,
  // getUpdatePost,
  // updatePost,
  deletePost,
};
