const { getUserFromDbUsingId } = require("../queries/userCollection");

const checkBuddy = async ({ buddyId }, ctx) => {
  let err = null;
  const buddyExists = await getUserFromDbUsingId(buddyId);

  if (!buddyExists) {
    err = {
      message: "Unauthorised Buddy Request",
      field: "buddy",
    };
    return err;ss
  }
  ctx.buddy = buddyExists;

  return err;
};
module.exports = { checkBuddy };
