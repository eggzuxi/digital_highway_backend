const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const Image = require('../models/SnsImage');
const Post = require('../models/SnsPost')
// const { isLoggedIn } = require('../middlewares/auth');
dotenv.config()

const router = express.Router();

//* aws region 및 자격증명 설정
AWS.config.update({
   region: 'ap-northeast-2',
   accessKeyId: process.env.S3_ACCESS_KEY_ID,
   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3()

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp']

//* AWS S3 multer 설정
const upload = multer({
   storage: multerS3({
      s3: s3,
      bucket: 'dhc-bucket-test',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      key: (req, file, callback) => {
         const uploadDirectory = req.query.directory ?? 'postImg' // 업로드할 디렉토리리를 설정
         const extension = path.extname(file.originalname) 
         if (!allowedExtensions.includes(extension)) { // extension 확인을 위한 코드
            return callback(new Error('wrong extension'))
         }
         callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`)
      },
      contentDisposition: 'inline',
   }),
   //* 용량 제한 해제
   // limits: { fileSize: 5 * 1024 * 1024 },
});

//* 로컬 multer 설정
const upload2 = multer(); // upload2.none() 용으로 사용

//* 싱글 또는 다중 이미지 파일 업로드 -> uploads/ 디렉토리에 이미지를 올린다.
router.post('/upload', upload.array('images', 10),  async(req, res) => {
   try {
      console.log(req.files); // files로 수정하였음

      const uploadedImages = []; // 이미지 여러장 저장하는 배열

      for (const file of req.files) {
         // 몽고 DB에 이미지 정보 저장
         const newImage = new Image({
            name: file.originalname,
            url: file.location,
         });
         await newImage.save();
         uploadedImages.push({ name: file.originalname, url: file.location });
      }

      res.json({ images: uploadedImages });

      const { writer, postTitle, postContent } = req.body; // writer 추가
      console.log(req.body); // req.body 내용 확인

      if (!writer || !postTitle || !postContent) {
         return res.status(400).json({ message: 'All fields are required.' });
      }

      const newPost = new Post({
         writer, // writer 추가
         postTitle,
         postContent,
         images: uploadedImages,
      });
      await newPost.save();

      // return res.json({ post: newPost, images: uploadedImages });

   } catch(error) {
      console.error('Error saving to MongoDb: ', error);
      res.status(500).send('Error uploading file!');
   }
});

module.exports = router;