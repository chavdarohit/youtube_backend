const { userCollection } = require("../config/dbconfig");
const { ObjectId } = require("mongodb");

async function signup(obj) {
  try {
    const ack = await userCollection.insertOne(obj);
    console.log("Data inserted ", ack);
    return ack;
  } catch (err) {
    console.log("Error while inserting data = ", err);
  }
}

const getUserFromDb = async (ctx) => {
  const user = await userCollection.findOne({
    userId: ctx.user.userId,
  });
  return user;
};

const getUserFromDbUsingId = async (uid) => {
  const user = await userCollection.findOne({
    userId: uid,
  });
  return user;
};
const getUserFromDbUsingEmail = async (email) => {
  const user = await userCollection.findOne({
    email,
  });
  return user;
};

const getBuddyFromDbUsingSearch = async (_searchTerm) => {
  return await userCollection
    .find(
      {
        $or: [
          { firstname: new RegExp(_searchTerm, "i") },
          {
            lastname: new RegExp(_searchTerm, "i"),
          },
        ],
      },
      {
        projection: {
          firstname: 1,
          lastname: 1,
          email: 1,
          userId: 1,
          image: 1,
          _id: 0,
        },
      }
    )
    .toArray();
};

const getUserChannelIds = async (uid) => {
  return userCollection.findOne(
    { userId: uid },
    { projection: { channelsSubscribed: 1, _id: 0 } }
  );
};

const getAllBuddies = async () => {
  return await userCollection
    .find(
      {},
      {
        projection: {
          firstname: 1,
          lastname: 1,
          email: 1,
          userId: 1,
          image: 1,
          _id: 0,
        },
      }
    )
    .toArray();
};

const addBuddyToUser = async (uid, bid) => {
  await userCollection.updateOne(
    {
      userId: uid,
    },
    {
      $addToSet: { buddies: bid },
    }
  );
};
const addUserToBuddy = async (uid, bid) => {
  await userCollection.updateOne(
    {
      userId: uid,
    },
    {
      $addToSet: { buddies: bid },
    }
  );
};

const getBuddyFromIds = async (buddysIds) => {
  return await userCollection
    .find({
      userId: { $in: buddysIds },
    })
    .toArray();
};

const subscribeUnsubscribe = async (uid, condition) => {
  return await userCollection.updateOne({ userId: uid }, condition);
};

const subscribeChannelForUser = async (uid, channelId) => {
  return await userCollection.updateOne(
    { userId: uid },
    {
      $addToSet: {
        channelsSubscribed: { id: new ObjectId(channelId), isbell: false },
      },
    }
  );
};

const unsubscribeChannelForUser = async (uid, channelId) => {
  return await userCollection.updateOne(
    {
      userId: uid,
    },
    {
      $pull: {
        channelsSubscribed: { id: new ObjectId(channelId) },
      },
    }
  );
};

const getUserChannelBellIconStatus = async (userId, channelId) => {
  return userCollection.findOne(
    {
      userId: userId,
      "channelsSubscribed.id": new ObjectId(channelId),
    },
    {
      projection: { "channelsSubscribed.$": 1, _id: 0 },
    }
  );
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
module.exports = {
  updateUserToPremium,
  updateUserChannelBellIconStatus,
  getUserChannelBellIconStatus,
  subscribeChannelForUser,
  getUserFromDb,
  unsubscribeChannelForUser,
  getUserFromDbUsingId,
  signup,
  getBuddyFromIds,
  getUserFromDbUsingEmail,
  getBuddyFromDbUsingSearch,
  getAllBuddies,
  addBuddyToUser,
  addUserToBuddy,
  subscribeUnsubscribe,
  getUserChannelIds,
};
