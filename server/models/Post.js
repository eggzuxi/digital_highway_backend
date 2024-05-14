const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// myPage 스키마
const PostSchema = new Schema({
  // 글 제목
  title: {
    type: String,
    required: true,
  },


  // 글 내용
  mainText: {
    type: String,
    required: true,
  },


  // 작성자
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },


  // 작성한 시간
  createdAt: {
    type: Date,
    default: Date.now,
  },


  // 조회수
  views: {
    type: Number,
    default: 0,
  },


  // 좋아요 추천
  ups: {
    type: Number,
    default: 0,
  },


  // 싫어요 비추천
  downs: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
