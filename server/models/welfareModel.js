const mongoose = require("mongoose");
const db = mongoose.connection.useDb('information');

const welfareSchema = new mongoose.Schema({
  //제목
  title:{
    type: String,
    required: true,
  },
  //담당부서
  department:{
    type: String,
  },
  //지원주기
  support:{
    type: String,
  },
  //제공유형
  service:{
    type:String,
  },
  //문의처
  tel:{
    type: String,
  },
  //링크
  link:{
    type: String,
    required: true,
  }
})

module.exports = db.model("Welfare", welfareSchema);