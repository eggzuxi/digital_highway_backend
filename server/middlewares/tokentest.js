const jwt = require("jsonwebtoken");
const { v4:uuidv4 } = require('uuid')

const authenticate = (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    if(!req.session.userID){
      req.session.userID = 'guest_' + uuidv4();
    }
    req.userID = req.session.userID;
    // console.log("게스트모드");
    // req.userID = 'guest';
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = decoded.userID;
    next();
  } catch (error) {
    return res.status(400).send("유효하지 않은 토큰입니다.");
  }
};

module.exports = authenticate;
