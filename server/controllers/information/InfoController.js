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
  const posts = await health.find({}).sort({ date: -1 });
  res.json(posts)
  // res.render("healthInfo", {posts:posts});
})

const getCulturePage = asyncHandler(async(req, res) => {
  const posts = await culture.find({}).sort({ date: -1 });
  res.json(posts)
  // res.render("culInfo", {posts:posts});
})

const getFinancePage = asyncHandler(async (req, res) => {
  const posts = await finance.find({});

  // 문자열 형식의 날짜를 JavaScript Date 객체로 변환한 후 정렬
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.date.replace('.', '-').replace('.', '-').replace(' ', ''));
    const dateB = new Date(b.date.replace('.', '-').replace('.', '-').replace(' ', ''));
    return dateB - dateA; // 내림차순 정렬
  });

  // 날짜 형식을 'YYYY-MM-DD'로 변환
  const formattedPosts = sortedPosts.map(post => {
    const date = new Date(post.date.replace('.', '-').replace('.', '-').replace(' ', ''));
    const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
    return { ...post.toObject(), date: formattedDate }; // 새 객체를 만들어 날짜 형식을 변경
  });

  res.json(formattedPosts);
  // res.render("finInfo", {posts: formattedPosts});
});


const getCareerPage = asyncHandler(async(req, res) => {
  const posts = await career.find({}).sort({ date: -1 });
  res.json(posts)
  // res.render("carInfo", {posts:posts});
})

const getWelfarePage = asyncHandler(async(req, res) => {
  const posts = await welfare.find();
  res.json(posts)
  // res.render("welInfo", {posts:posts});
})

const bookmark = asyncHandler(async (req, res) => {
  const { postId, category } = req.body;
  const token = req.cookies.token;

  if (!token) {
    console.log("게스트모드");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { tokenId } = jwt.verify(token, jwtSecret);
    const mark = await Mypage.findOne({ userID: tokenId });

    if (!mark) {
      return res.status(404).json({ message: "User not found" });
    }

    let post;
    switch (category) {
      case "문화":
        post = await culture.findById(postId);
        break;
      case "의료":
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
      return res.status(404).json({ message: "Post not found" });
    }

    // 이미 즐겨찾기된 항목이 있는지 확인
    const existingBookmarkIndex = mark.bookmarks.findIndex(
      (item) => item.category === category && item.title === post.title
    );

    if (existingBookmarkIndex !== -1) {
      // 해당 postId를 가진 즐겨찾기를 제거
      mark.bookmarks.splice(existingBookmarkIndex, 1);
      await mark.save();
      return res.status(200).json({ message: "Bookmark removed successfully" });
    } else {
      // postId가 존재하지 않는 경우, 즐겨찾기 목록에 추가
      mark.bookmarks.push({
        category,
        title: post.title,
        link: post.link
      });

      await mark.save();
      return res.status(201).json({ message: "Bookmark added successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {getHealthPage, getCulturePage, getFinancePage, getCareerPage, getWelfarePage, bookmark};