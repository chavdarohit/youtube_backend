const jwt = require("jsonwebtoken");

function makeJwtToken(userId) {
  try {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });
    return token;
  } catch (err) {
    console.log("Error while making json token", err);
  }
}

module.exports = makeJwtToken;
