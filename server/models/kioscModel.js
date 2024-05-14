const mongoose = require("mongoose");
const db = mongoose.connection.useDb('device');

const orderSchema = new mongoose.Schema({
  //버거종류
  burger:{
    type: String,
  },
  //사이드종류
  side:{
    type: String,
  },
  //음료 종류
  drink:{
    type: String,
  },
  //갯수
  ea:{
    type: Number,
  },
  //가격
  price:{
    type: Number,
  },
})

const kioscSchema = new mongoose.Schema({
  //회원ID
  userID:{
    type: String,
    required: true
  },
  //주문내역
  orders: [orderSchema],
  //총 가격
  totalPrice: {
    type: Number,
  },
  
},{versionKey:false})

module.exports = db.model("Kiosc", kioscSchema);