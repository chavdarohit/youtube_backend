const jwt = require("jsonwebtoken");

function makeJwtToken(objId) {
  const token = jwt.sign({ objId }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
  return token;
}

module.exports = makeJwtToken;
