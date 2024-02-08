const jwt = require("jsonwebtoken");
const {
  getUserFromDb,
  getUserFromDbUsingId,
} = require("../queries/userCollection");

require("dotenv").config();

async function verifyToken(ctx, next) {
  const token = ctx.cookies.get("token");
  // console.log("Token is ", token);
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized - Missing Token" };
    console.log("Token missing ", "Unauthorized - Missing Token");
    return;
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // ctx.user = decode;
    const user = await getUserFromDbUsingId(decode.userId);
    ctx.state.user = user;
    console.log(
      "Token verified succesfully for ",
      user.firstname,
      user.lastname
    );
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      error: "Unauthorized user - Bad Request from middleware",
    };
    // console.log("Token decode error ", "Unauthorized");
  }
}
module.exports = verifyToken;
