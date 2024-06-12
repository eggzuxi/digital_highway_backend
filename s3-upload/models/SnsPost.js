const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SnsPostSchema = new Schema({
  // 게시물 제목
  postTitle: {
    type: String,
    required: true,
  },

  // 게시물 내용
  postContent: {
    type: String,
    required: true,
  },

  // 게시물 작성자
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // 게시물 생성 날짜
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // 하트 버튼
  ups: {
    type: Number,
    default: 0,
  },
});

const SnsPost = mongoose.model("Post", SnsPostSchema);

module.exports = SnsPost;
