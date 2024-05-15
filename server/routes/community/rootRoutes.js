const express = require("express");

/* Middlewares */
const checkNotLogin = require("../../middlewares/checkNotLogin");

/* Controllers */
const {
  getHome,
  postLogin,
  postJoin,
  getLogout,
} = require("../../controllers/community/rootController");

const router = express.Router();

router.route("/login").post(postLogin);
router.route("/join").post(postJoin);
router.route("/logout").get(getLogout);

module.exports = router;
