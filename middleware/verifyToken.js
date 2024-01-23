const jwt = require("jsonwebtoken");
require("dotenv").config();

async function verifyToken(ctx, next) {
  console.log("Cokkies token = ", ctx.cookies.get("token"));

  // const token = ctx.cookies.get("token");
  // if (!token) {
  //   ctx.status = 401;
  //   ctx.body = { error: "Unauthorized - Missing Token" };
  //   return;
  // }
  // try {
  //   const decode = jwt.verify(token, process.env.SECRET_KEY);
  //   ctx.user = decode;
  //   console.log("Token verified successfully id is = ", ctx.user);
  //   await next();
  // } catch (err) {
  //   ctx.status = 401;
  //   ctx.body = {
  //     error: "Unauthorized user - Missing token",
  //   };
  // }
}
module.exports = verifyToken;
