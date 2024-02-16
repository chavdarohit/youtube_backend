const { getUserFromDbUsingId } = require("../queries/userCollectionQueries");
const jwt = require("jsonwebtoken");

const checkBuddy = async ({ buddyId }, ctx) => {
  let err = null;
  const buddyExists = await getUserFromDbUsingId(buddyId);

  if (!buddyExists) {
    err = {
      message: "Unauthorised Buddy Request",
      field: "buddy",
    };
    return err;
  }
  ctx.buddy = buddyExists;

  return err;
};

const checkBuddyAlreadyExists = async ({ token, decision }, ctx) => {
  let err = null;
  if (decision === "reject") {
    err = {
      status: 200,
      message: "Request adding buddy rejected",
    };
    return err;
  }

  const { userId, buddyId } = jwt.verify(token, process.env.SECRET_KEY);
  const buddy = await getUserFromDbUsingId(buddyId);
  const user = await getUserFromDbUsingId(userId);

  if (!buddy) {
    err = {
      status: 204,
      message: "Buddy not exists",
    };
    return err;
  }
  //   console.log(user);
  if (user.buddies.includes(buddyId)) {
    err = {
      status: 200,
      message: "Buddy Already added",
    };
    return err;
  }
  ctx.state.user = user;
  ctx.buddy = buddy;
  //   console.log("in context ", ctx.state.user.userId, ctx.buddy.Id);

  return err;
};

module.exports = { checkBuddy, checkBuddyAlreadyExists };
