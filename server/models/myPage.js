const mongoose = require("mongoose");
const db = mongoose.connection.useDb('main')

// myPage 스키마
// myPage에서 user의 post와 comment 확인 가능
const myPageSchema = new mongoose.Schema({

  // 로그인 후 유저아이디가 User에 저장됨
  // User 스키마로 부터 유저아이디를 받아옴
  // 전체 DB 중에 있는 User 스키마임 -> 전체 DB를 어떻게 짤 것인지 erd cloud
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",    
  },

  // // 비밀번호
  // password: {
  //   type: String,
  //   required: true,
  // },

  // 작성한 글 (Post schema에서 받아옴)
  myPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  
  // 댓글 (Comment schema에서 받아옴)
  myComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }
  ],

  // myGuide: [

  // ]
});

const myPage = mongoose.model("myPage", myPageSchema);

module.exports = myPage;
