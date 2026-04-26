const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'rentify_dev_secret';

exports.generateToken = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: '7d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
