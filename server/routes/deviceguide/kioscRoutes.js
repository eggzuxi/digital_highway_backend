const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const {getOrderList, orderCreate, orderUpdate,orderComplete} = require("../../controllers/deviceguide/KioscController")

router.use(cookieParser());

//deviceguides/kiosc_03
router.route("/kiosc_03")
  .get(getOrderList)
  .post(orderCreate)
  .put(orderUpdate)
  .delete(orderComplete)

module.exports = router;