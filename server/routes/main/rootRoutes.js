const express = require("express");

/* Middlewares */
const checkNotLogin = require("../../middlewares/checkNotLogin");

/* Controllers */
const {
  postLogin,
  postJoin,
  postLogout,
} = require("../../controllers/main/rootController");

const router = express.Router();

router.route("/login").post(postLogin);
router.route("/join").post(postJoin);
router.route("/logout").get(postLogout);

module.exports = router;
