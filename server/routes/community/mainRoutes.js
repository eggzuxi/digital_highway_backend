const express = require("express");

/* Middlewares */
const checkLogin = require("../../middlewares/checkLogin");
const { imageUpload } = require("../../middlewares/imageUpload");

/* Controllers */
const {
  showCommunity,
  seePost,
  addComment,
  // updateUps,
  // updateDowns,
  // getAddPost,
  postAddPost,
  // getUpdatePost,
  // updatePost,
  // deletePost,
} = require("../../controllers/community/mainController");

const router = express.Router();

router.route("/").get(showCommunity);

router
  .route("/addPost")
  .all(checkLogin)
  // .get(getAddPost)
  .post(postAddPost);

router.route("/:id")
// .all(checkLogin)
.get(seePost);
// router
//   .route("/:id/updatePost")
//   .all(checkLogin)
//   .get(getUpdatePost)
//   .put(imageUpload.single("image"), updatePost);
// router.route("/:id/deletePost").all(checkLogin).delete(deletePost);
router.route("/:id/addComment").all(checkLogin).post(addComment);
// router.route("/:id/updateUps").all(checkLogin).put(updateUps);
// router.route("/:id/updateDowns").all(checkLogin).put(updateDowns);
module.exports = router;
