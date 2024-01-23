const jwt = require("jsonwebtoken");

function makeJwtToken(objId) {
  const token = jwt.sign({ objId }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
}

module.exports = makeJwtToken;
