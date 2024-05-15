// main schema로 빠져야함

const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const db = mongoose.connection.useDb('main');

// User 스키마
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },

  userID:{
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  phoneNum: {
    type: String,
    required: true,
  }
});

const User = db.model("User", UserSchema);

module.exports = User;
