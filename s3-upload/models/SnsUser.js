const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// sns는 profle과 post를 이어하기 기능

// User 스키마
const SnsUserSchema = new Schema({

  //회원 id
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",    
  },

  // 프로필 사진
  // 달팽이 사진 로드
  // imageUpload
  profile: {

  },

  // 소개글
  bio : {
    type: String,
    require: true,
  },

  // 게시물
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  // 게시물 이미지
  // aws s3에 사진 저장
  uploadimage: {

  },
});

const SnsUser = mongoose.model("SnsUser", SnsUserSchema);

module.exports = SnsUser;
