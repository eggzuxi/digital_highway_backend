const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")
const Kiosc = require("../../models/kioscModel");

// @desc Get orderlist
// @route GET /kiosc_03
const getOrderList = asyncHandler(async(req, res) => {
  const {userID} = req.query
  const order = await Kiosc.findOne({userID})
  console.log(order)
  res.json(order)
})

//@desc POST order
//@route POST /kiosc_03
const orderCreate = async(req,res) => {
  const {userID, orders} = req.body;

  let userOrder = await Kiosc.findOne({userID});

  const calculatedTotalPrice = orders.reduce((total, order)=>{
    return total + (order.ea * order.price);
  },0);

  if (!userOrder) {
    userOrder = new Kiosc({
      userID,
      orders,
      totalPrice: calculatedTotalPrice
    });
  }else{
    userOrder.orders.push(...orders);
    userOrder.totalPrice += calculatedTotalPrice;
  }

  await userOrder.save();
  
  console.log(userOrder)
  res.json(userOrder)
}

//@desc UPDATE order
//@route UPDATE /kiosc_03
const orderUpdate = asyncHandler(async(req,res)=>{
  const {userID, orders, totalPrice} = req.body;

  const userOrder = await Kiosc.findOne({userID});

  if(!userOrder){
    return res.status(404).json({message:'해당 유저를 찾을 수 없습니다'});
  }

  userOrder.orders = orders

  // 전체 주문 가격 재계산
  userOrder.totalPrice = userOrder.orders.reduce((total, orderItem) => {
      return total + (orderItem.ea * orderItem.price);
  }, 0);

  // 수정된 주문을 데이터베이스에 저장
  await userOrder.save();

  // 응답으로 수정된 주문 반환
  res.json(userOrder);
})

//@desc DELETE order
//@route DELETE /kiosc_03
const orderComplete = asyncHandler(async (req, res) => {
  const {userID} = req.body;
  try{
    const result = await Kiosc.deleteOne({userID});
    if(result.deletedCount === 1){
      res.status(200).json({ success: true, message: "문서가 성공적으로 삭제되었습니다." });
    }else {
      res.status(404).json({ success: false, message: "해당 userID에 맞는 문서를 찾을 수 없습니다." });
    }
  }catch(error){
    res.status(500).json({ success: false, message: "문서 삭제 중 에러가 발생했습니다.", error: error.message });
  }
});

module.exports = {getOrderList, orderCreate, orderUpdate, orderComplete}