const mongoose = require("mongoose");
const db = mongoose.connection.useDb('information');

const careerSchema = new mongoose.Schema({
  //제목
  title:{
    type: String,
    required: true,
  },
  //언론사
  press:{
    type: String,
  },
  //작성일
  date:{
    type: String,
  },
  //링크
  link:{
    type: String,
    required: true,
  }
})

module.exports = db.model("Career", careerSchema);