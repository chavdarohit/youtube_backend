const jwt = require("jsonwebtoken");
// const { getUserFromDbUsingId } = require("../queries/userCollectionQueries");
const userCollectionQueries = require("../queries/userCollectionQueries");

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
    const user = await userCollectionQueries.getUserFromDbUsingId(
      decode.userId
    );
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
  }
}
module.exports = verifyToken;
