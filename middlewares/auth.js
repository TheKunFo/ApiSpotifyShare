const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next(); // ⬅️ inilah next yang EXPRESS kasih
  } catch (err) {
    let message = 'Invalid or expired token';
    if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
      message = 'Token expired';
    }
    return res.status(401).json({ message });
  }
};
