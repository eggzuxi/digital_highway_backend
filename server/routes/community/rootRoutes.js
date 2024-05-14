const express = require("express");

/* Middlewares */
const checkNotLogin = require("../../middlewares/checkNotLogin");

/* Controllers */
const {
  getHome,
  getLogin,
  postLogin,
  getJoin,
  postJoin,
  getLogout,
} = require("../../controllers/community/rootController");

const router = express.Router();

router.route("/").all(checkNotLogin).get(getLogin).post(postLogin);
router.route("/join").all(checkNotLogin).get(getJoin).post(postJoin);
router.route("/logout").get(getLogout);

module.exports = router;
