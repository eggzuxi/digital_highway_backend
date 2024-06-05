const express = require("express");

const checkLogin = require("../../middlewares/checkLogin");

const {showUserPage, updatePw, updatePhone, getMypage} = require("../../controllers/main/mypageController")

const router = express.Router();

router.route("/").all(checkLogin).get(showUserPage);
router.route("/data").get(getMypage)
router.route("/updatePw").put(updatePw);
router.route("/updatedPhone").put(updatePhone);

module.exports = router;