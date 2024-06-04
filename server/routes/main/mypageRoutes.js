const express = require("express");

const checkLogin = require("../../middlewares/checkLogin");

const {showMyPage, updatePw, updatePhone} = require("../../controllers/main/mypageController")

const router = express.Router();

router.route("/").all(checkLogin).get(showMyPage);
router.route("/updatePw").put(updatePw);
router.route("/updatedPhone").put(updatePhone);

module.exports = router;