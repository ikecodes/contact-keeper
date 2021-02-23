const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  ///Get Token from Header
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, Authurization Denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      msg: 'Token is InVALID',
    });
  }
};
