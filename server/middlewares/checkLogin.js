require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const notifier = require("node-notifier");

const checkLogin = async (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  const token = req.cookies.token;
  
  if (!token) {
    notifier.notify({
      title: "디지털지름길",
      message: "로그인이 필요한 서비스입니다.",
    });
    return res.status(401).json({ error: "JWT must be provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.tokenId = decoded.id;  // 토큰에서 사용자 ID를 추출하여 요청 객체에 저장
    next();
  } catch (error) {
    console.error('JWT 검증 중 오류 발생:', error);
    notifier.notify({
      title: "디지털지름길",
      message: "유효하지 않은 토큰입니다.",
    });
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = checkLogin;
