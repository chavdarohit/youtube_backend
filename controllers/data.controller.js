const { collection } = require("../dbacess");
const { ObjectId } = require("mongodb");

async function viewProfile(ctx) {
  const userId = ctx.user.objId;
  console.log("User id in view profile ", userId);
  const user = await collection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    ctx.status = 404;
    ctx.body = "User Not found";
    console.log("User not found in Db");
    return;
  } else {
    ctx.body = {
      status: 200,
      user,
    };
    console.log("View Profile succesfully");
  }
}

module.exports = {
  viewProfile,
};
