const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  // 실제로는 여기에 사용자 인증 로직을 추가해야 합니다.
  // 예시로 사용자가 JWT 토큰을 가지고 있는지 여부를 확인하는 논리를 추가합니다.
  
  // JWT 토큰을 요청 헤더에서 추출합니다.
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    // 토큰이 없으면 권한이 없음을 응답합니다.
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // 토큰을 검증합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 검증된 토큰에서 사용자 정보를 추출할 수 있다면 다음 미들웨어로 이동합니다.
    req.user = decoded; // 요청 객체에 사용자 정보를 저장합니다.
    return next();
  } catch (err) {
    // 토큰이 유효하지 않은 경우 권한이 없음을 응답합니다.
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { isLoggedIn };

