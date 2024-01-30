const { userCollection, suggestedCollection } = require("../dbacess");
const { ObjectId } = require("mongodb");

async function viewProfile(ctx) {
  const userId = ctx.user.userId;
  console.log("User id in view profile ", userId);
  const user = await userCollection.findOne({ userId: userId });
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
  const userId = ctx.user.userId;
  const { _limit, _page, _searchTerm } = ctx.query;

  const limit = parseInt(_limit) || 10;
  const page = parseInt(_page) || 1;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const user = await userCollection.findOne({ userId: userId });
  const channels = await suggestedCollection.find({}).toArray();

  const ispremium = user.isPremium;

  //this is the subscribed channel already subscribe by user
  const userschannel = await userCollection.findOne(
    { userId: userId },
    { projection: { channelsSubscribed: 1, _id: 0 } }
  );

  //filtering and removing channels which is already subscribed by the user
  let filteredChannel;
  try {
    if (userschannel.channelsSubscribed.length === 0) {
      filteredChannel = channels;
    } else {
      filteredChannel = channels.filter(
        (item1) =>
          !userschannel.channelsSubscribed.some(
            (item2) => item1._id.toHexString() === item2.id.toHexString()
          )
      );
      // console.log("Filtered ", filteredChannel);
    }
  } catch (err) {
    console.log("error filtering data");
  }

  if (_searchTerm) {
    const regex = new RegExp(_searchTerm, "i");
    console.log("in search");
    // Test if the word is present in the string
    const searchChannels = filteredChannel.reduce((acc, item) => {
      if (regex.test(item.channelName)) {
        return [...acc, item];
      }

      return acc;
    }, []);

    if (searchChannels.length === 0) {
      ctx.body = {
        status: 202,
        channels: searchChannels,
      };
      return;
    } else {
      ctx.body = {
        status: 200,
        channels: searchChannels,
      };
      return;
    }
  }
  console.log("Showing limited channels");

  if (!ispremium) {
    filteredChannel = filteredChannel.filter(
      (item) => item.isPremium === false
    );
  }

  let limitchannels = filteredChannel.slice(startIndex, endIndex); //channels with limit
  // console.log("limit chNNELS : ", startIndex, endIndex, limitchannels);
  console.log("suggested Channels fetched by ", user.firstname, user.lastname);
  ctx.body = {
    status: 200,
    channels: limitchannels,
  };
}

async function subscribeChannel(ctx) {
  const userId = ctx.user.userId;
  const channelId = ctx.params.id;
  console.log("id ", userId, " channel id ", channelId);
  try {
    const channel = await suggestedCollection.findOne({
      _id: new ObjectId(channelId),
    });
    console.log("channel for subscribng ", channel.channelName);

    const ack = await userCollection.updateOne(
      { userId: userId },
      {
        $addToSet: {
          channelsSubscribed: { id: new ObjectId(channelId), isbell: false },
        },
      }
    );

    if (ack.modifiedCount === 0) {
      ctx.body = {
        status: 201,
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

async function viewSubscribedChannel(ctx) {
  const userId = ctx.user.userId;
  try {
    const userschannel = await userCollection.findOne({
      userId: userId,
    });

    //taken the ids of the subscribed array into another array
    const ids = userschannel.channelsSubscribed.map((item) => item.id);

    // fetching th items from the all channels and selecting that where the user has subscribed
    const channels = await suggestedCollection
      .find({ _id: { $in: ids } })
      .toArray();

    console.log("view channel subscribed ");

    if (channels.length === 0) {
      ctx.body = { status: 204, channels };
    } else {
      ctx.body = { status: 200, channels };
    }
  } catch (err) {
    ctx.body = { status: 204, channels: [] };
    console.log("Error viewing channel subscribed", err);
  }
}

const pressBellIcon = async (ctx) => {
  const userId = ctx.user.userId;
  const channelId = ctx.params.id;
  console.log("176", userId, channelId);
  try {
    const ack = await userCollection.updateOne(
      {
        userId: userId,
        "channelsSubscribed.id": new ObjectId(channelId),
      },
      {
        $set: {
          "channelsSubscribed.$.isbell": false,
        },
      }
    );
    // const ack = await userCollection
    //   .aggregate([
    //     {
    //       $match: {
    //         "channelsSubscribed.id": new ObjectId(channelId),
    //       },
    //     },
    //     {
    //       $set: {
    //         channelsSubscribed: {
    //           $map: {
    //             input: "$channelsSubscribed",
    //             as: "channel",
    //             in: {
    //               $mergeObjects: [
    //                 "$$channel",
    //                 {
    //                   isBell: {
    //                     $cond: {
    //                       if: {
    //                         $eq: ["$$channel.id", new ObjectId(channelId)],
    //                       },
    //                       then: { $not: "$$channel.isBell" },
    //                       else: "$$channel.isBell",
    //                     },
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ])
    //   .toArray();

    // db.users.aggregate([
    //   {
    //     $match: {
    //       _id: ObjectId("65b8a04702d31400be7a7439"),
    //     },
    //   },
    //   {
    //     $project: {
    //       channelsSubscribed: {
    //         $map: {
    //           input: "$channelsSubscribed",
    //           as: "channel",
    //           in: {
    //             $cond: [
    //               {
    //                 $eq: ["$$channel.id", ObjectId("65b21f6dbd942237aec0496a")],
    //               },
    //               {
    //                 $mergeObjects: [
    //                   "$$channel",
    //                   {
    //                     isbell: {
    //                       $not: "$$channel.isbell",
    //                     },
    //                   },
    //                 ],
    //               },
    //               "$$channel",
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    // ]);

    if (ack.modifiedCount === 0) {
      ctx.body = { status: 204, message: "Problem in Bell icon" };
      console.log("Problem in Bell icon");
      return;
    } else {
      ctx.body = { status: 200, message: "Updated Bell Icon" };
      console.log("Updated Bell Icon");
    }
  } catch (err) {
    console.log("Error while updating the bell icon", err);
  }
};

const makeUserPremium = async (ctx) => {
  try {
    const userId = ctx.user.userId;
    // const user = await userCollection.findOne({
    //   userId: userId,
    // });
    // console.log("user in premiuim ", user, userId);
    const ack = await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      [{ $set: { isPremium: { $not: "$isPremium" } } }]
    );
    console.log("ack ", ack);
    if (ack) {
      console.log("User account Upgraded");
      ctx.body = { status: 200, message: "User made Premium", user: ack };
    }
  } catch (err) {
    ctx.body = { status: 201, message: "Error making premium" };
    console.log("Error making premium", err);
  }
};

module.exports = {
  viewProfile,
  suggestedChannels,
  subscribeChannel,
  viewSubscribedChannel,
  pressBellIcon,
  makeUserPremium,
};
