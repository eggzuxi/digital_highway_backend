const mongoose = require("mongoose");
const db = mongoose.connection.useDb('main')

const bookmarkSchema = new mongoose.Schema({
  category:{
    type:String,
  },
  title:{
    type:String,
  },
  link:{
    type:String
  }
})

// myPage 스키마
// myPage에서 user의 post와 comment 확인 가능
const MyPageSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",    
  },

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

  bookmarks: [bookmarkSchema],

  // myGuide: [

  // ]
},{versionKey:false});

const myPage = db.model("MyPage", MyPageSchema);

module.exports = myPage;
