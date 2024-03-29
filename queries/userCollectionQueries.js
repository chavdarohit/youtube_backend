const { userCollection } = require("../config/dbconfig");

async function signup(obj) {
  try {
    const ack = await userCollection.insertOne(obj);
    console.log("Data inserted ", ack);
    return ack;
  } catch (err) {
    console.log("Error while inserting data = ", err);
  }
}

const getUsersFromDb = async (condition, projection) => {
  console.log("calling original getusersfromdb");
  const users = await userCollection.find(condition, projection).toArray();
  return users;
};
const bulkWriteInDb = async (operations) => {
  return await userCollection.bulkWrite(operations);
};

const getUserFromDbUsingId = async (uid) => {
  console.log("callling original getUserFromDbUsing ID function");
  const user = await userCollection.findOne({
    userId: uid,
  });
  return user;
};

const getUserFromDbUsingEmail = async (email) => {
  console.log("calling original getUserFromDbUsingEmail function");
  const user = await userCollection.findOne({
    email,
  });
  return user;
};

const updateUser = async (uid, condition) => {
  return await userCollection.updateOne({ userId: uid }, condition);
};

const updateUserChannelBellIconStatus = async (userId, channelId, update) => {
  return userCollection.updateOne(
    {
      userId: userId,
      "channelsSubscribed.channelId": channelId,
    },
    {
      $set: { "channelsSubscribed.$.isbell": update },
    }
  );
};

const updateUserToPremium = async (userId) => {
  return userCollection.findOneAndUpdate(
    {
      userId: userId,
    },
    [{ $set: { isPremium: { $not: "$isPremium" } } }],
    {
      returnDocument: "after",
    }
  );
};

const getDataFromAggregation = async (pipeline) => {
  return userCollection.aggregate(pipeline).toArray();
};

module.exports = {
  getDataFromAggregation,
  updateUserToPremium,
  updateUser,
  updateUserChannelBellIconStatus,
  getUsersFromDb,
  getUserFromDbUsingId,
  bulkWriteInDb,
  signup,
  getUserFromDbUsingEmail,
};
