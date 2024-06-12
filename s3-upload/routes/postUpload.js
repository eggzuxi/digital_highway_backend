// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const AWS = require("aws-sdk");
// const multerS3 = require('multer-s3');
// const dotenv = require('dotenv');
// const Image = require('../models/SnsImage');
// const Post = require('../models/SnsPost');
// // const { isLoggedIn } = require('../middlewares/auth');
// dotenv.config();

// const router = express.Router();

// //* aws region 및 자격증명 설정
// AWS.config.update({
//    region: 'ap-northeast-2',
//    accessKeyId: process.env.S3_ACCESS_KEY_ID,
//    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
// });

// const s3 = new AWS.S3();

// const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

// //* AWS S3 multer 설정
// const upload = multer({
//    storage: multerS3({
//       s3: s3,
//       bucket: 'dhc-bucket-test',
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       acl: "public-read",
//       key: (req, file, callback) => {
//          const uploadDirectory = req.query.directory ?? 'postImg';
//          const extension = path.extname(file.originalname);
//          if (!allowedExtensions.includes(extension)) {
//             return callback(new Error('wrong extension'));
//          }
//          callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
//       },
//       contentDisposition: 'inline',
//    }),
// });

// //* 로컬 multer 설정
// const upload2 = multer(); // upload2.none() 용으로 사용

// //* 게시글 작성 및 이미지 업로드
// router.post('/post', upload.array('images', 10), async (req, res) => {
//    try {
//       const { title, content } = req.body;

//       const uploadedImages = [];

//       for (const file of req.files) {
//          // 몽고 DB에 이미지 정보 저장
//          const newImage = new Image({
//             name: file.originalname,
//             url: file.location,
//          });
//          await newImage.save();
//          uploadedImages.push({ name: file.originalname, url: file.location });
//       }

//       // 게시글 정보와 이미지 URL을 MongoDB에 저장
//       const newPost = new Post({
//          title,
//          content,
//          images: uploadedImages,
//       });
//       await newPost.save();

//       res.json({ post: newPost });

//    } catch (error) {
//       console.error('MongoDB 저장 오류: ', error);
//       res.status(500).send('게시글 저장 오류!');
//    }
// });

// module.exports = router;
