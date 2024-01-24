const jwt = require("jsonwebtoken");
require("dotenv").config();

async function verifyToken(ctx, next) {

  const token = ctx.cookies.get("token");
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized - Missing Token" };
    console.log("Token missing ", "Unauthorized - Missing Token");
    return;
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    ctx.user = decode;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      error: "Unauthorized user - Bad Request",
    };
    console.log("Token decode error ", "Unauthorized");
  }
}
module.exports = verifyToken;
