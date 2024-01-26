const jwt = require("jsonwebtoken");
require("dotenv").config();

async function verifyToken(ctx, next) {
  const token = ctx.cookies.get("token");
  console.log("Token is ", token);
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized - Missing Token" };
    console.log("Token missing ", "Unauthorized - Missing Token");
    return;
  }
  try {
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    ctx.user = decode;
    console.log("Token verified succesfully");
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      error: "Unauthorized user - Bad Request",
    };
    // console.log("Token decode error ", "Unauthorized");
  }
}
module.exports = verifyToken;
