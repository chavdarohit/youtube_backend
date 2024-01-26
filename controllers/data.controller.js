const { collection, suggestedCollection } = require("../dbacess");
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

async function suggestedChannels(ctx) {
  const channels = await suggestedCollection.find({}).toArray();
  console.log("suggested Channels fetched by ", ctx.user.objId);
  ctx.body = {
    status: 200,
    channels,
  };
}

async function subscribeChannel(ctx) {
  const userId = ctx.user.objId;
  const channelId = ctx.params.channelid;
  console.log("id ", userId, " channel id ", channelId);
  try {
    const channel = await suggestedCollection.findOne({
      _id: new ObjectId(channelId),
    });
    console.log("channel for subscribng ", channel);

    const ack = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { channelsSubscribed: channelId } }
    );

    if (ack.modifiedCount === 0) {
      ctx.body = {
        status: 200,
        massage: "Already Subscribed ",
      };
      console.log("Already Subscribed", ack);
    } else {
      ctx.body = {
        status: 200,
        massage: "Subscribed Succesfully",
      };
      console.log("Subscribed Succesfully", ack);
    }
  } catch (err) {
    console.error("Error updating data:", err);
    ctx.body = {
      status: 401,
      massage: "There is something wrong while subscribe",
    };
  }
}

module.exports = {
  viewProfile,
  suggestedChannels,
  subscribeChannel,
};
