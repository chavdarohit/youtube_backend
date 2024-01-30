const jwt = require("jsonwebtoken");

function makeJwtToken(userId) {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
  return token;
}

module.exports = makeJwtToken;
