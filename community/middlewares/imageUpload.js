const multer = require("multer");

const imageUpload = multer({
  dest: "public/uploads/",
  limits: { fileSize: 3000000 },
});

module.exports = {
  imageUpload,
};
