const { userCollection } = require("../dbacess");

const getUserFromDb = async (ctx) => {
  const user = await userCollection.findOne({
    userId: ctx.user.userId,
  });
  return user;
};

module.exports = getUserFromDb;
