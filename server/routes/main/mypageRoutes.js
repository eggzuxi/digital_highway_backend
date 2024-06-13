const express = require("express");

const checkLogin = require("../../middlewares/checkLogin");

const {showUserPage, updatePw, updateTel, getMypage, findUserId} = require("../../controllers/main/mypageController")

const router = express.Router();

router.route("/").all(checkLogin).get(showUserPage);
router.route("/data").get(getMypage)
router.route("/updatePw").put(updatePw);
router.route("/updateTel").put(updateTel);
router.route("/find-id").post(findUserId);  

module.exports = router;