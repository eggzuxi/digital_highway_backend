const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  // 댓글 내용
  commentContent: {
    type: String,
    required: true,
  },

  // 작성자
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // comments를 저장한 post
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // 작성한 시간
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // strictPopulate: false
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
