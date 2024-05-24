const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const {getOrderList, orderCreate, orderUpdate,orderComplete} = require("../../controllers/deviceguide/KioscController")
const authenticate = require("../../middlewares/tokentest")

router.use(cookieParser());

//deviceguides/kiosc_03
router.route("/kiosc_03")
  .get(authenticate, getOrderList)
  .post(authenticate, orderCreate)
  .put(authenticate, orderUpdate)
  .delete(authenticate, orderComplete)

module.exports = router;