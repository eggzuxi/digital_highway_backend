const express = require("express");
const multer = require('multer');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const { S3 } = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
dotenv.config();

/* Middlewares */
const checkLogin = require("../../middlewares/checkLogin");
const { imageUpload } = require("../../middlewares/imageUpload");

/* Controllers */
const {
  showCommunity,
  seePost,
  addComment,
  updateUps,
  // updateDowns,
  postAddPost,
  getUpdatePost,
  updatePost,
  deletePost,
} = require("../../controllers/community/mainController");

const router = express.Router();

// AWS S3 클라이언트 초기화
const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

//* AWS S3 multer 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dhc-bucket-test',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, callback) => {
        const uploadDirectory = req.query.directory ?? 'postImg'; // 업로드할 디렉토리를 설정
        const extension = path.extname(file.originalname);
        if (!allowedExtensions.includes(extension)) { // extension 확인을 위한 코드
          return callback(new Error('wrong extension'));
        }
        callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
    },
    contentDisposition: 'inline',
  }),
  //* 용량 제한 해제
  // limits: { fileSize: 5 * 1024 * 1024 },
});

//* 로컬 multer 설정
const upload2 = multer(); // upload2.none() 용으로 사용

router.route("/").get(showCommunity);

router
  .route("/addPost")
  .all(checkLogin)
  // .get(getAddPost)
  .post(upload.array('images',10), postAddPost);

router.route("/:id")
// .all(checkLogin)
.get(seePost);
router
  .route("/:id/updatePost")
  .get(getUpdatePost)
  .put(upload.array('images',10),updatePost);
router.route("/:id/deletePost").delete(deletePost);
router.route("/:id/addComment").all(checkLogin).post(addComment);
router.route("/:id/updateUps").all(checkLogin).put(updateUps);
// router.route("/:id/updateDowns").all(checkLogin).put(updateDowns);
module.exports = router;
