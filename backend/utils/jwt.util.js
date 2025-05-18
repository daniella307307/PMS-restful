const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign({ id: user.id, role: user.role },process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
};

module.exports = generateToken;