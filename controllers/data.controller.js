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
  try {
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
      let searchChannels = await suggestedCollection
        .find({
          channelName: new RegExp(_searchTerm, "i"),
        })
        .toArray();

      if (!ispremium) {
        searchChannels = searchChannels.filter(
          (item) => item.isPremium === false
        );
      }

      // console.log("search channels ", searchChannels);
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
    console.log(
      "suggested Channels fetched by ",
      user.firstname,
      user.lastname
    );
    ctx.body = {
      status: 200,
      channels: limitchannels,
    };
  } catch (err) {
    console.log("error while suggestion ", err);
  }
}

async function subscribeChannel(ctx) {
  const userId = ctx.user.userId;
  const channelId = ctx.params.id;
  console.log("id ", userId, " channel id ", channelId);
  try {
    const channel = await suggestedCollection.findOne({
      _id: new ObjectId(channelId),
    });
    // console.log("channel for subscribng ", channel.channelName);

    const addtosetack = await userCollection.updateOne(
      { userId: userId },
      {
        $addToSet: {
          channelsSubscribed: { id: new ObjectId(channelId), isbell: false },
        },
      }
    );
    if (addtosetack.modifiedCount > 0) {
      ctx.body = {
        status: 200,
        massage: "Subscribed Succesfully",
      };
      console.log("Subscribed Succesfully");
    } else {
      const pullack = await userCollection.updateOne(
        {
          userId: userId,
        },
        {
          $pull: {
            channelsSubscribed: { id: new ObjectId(channelId) },
          },
        }
      );
      if (pullack.modifiedCount > 0) {
        ctx.body = {
          status: 200,
          massage: "Channel Unsubscribed",
        };
        console.log("Channel Unsubscribed");
      } else {
        ctx.body = {
          status: 204,
          massage: "Channel Not found",
        };
        console.log("Channel Not found");
      }
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
  try {
    const ack = await userCollection.findOne(
      {
        userId: userId,
        "channelsSubscribed.id": new ObjectId(channelId),
      },
      {
        channelsSubscribed: { $elemMatch: { id: new ObjectId(channelId) } },
      }
    );
    console.log(ack);

    if (ack.modifiedCount === 0) {
      ctx.body = { status: 204, message: "No channel found for bell icon" };
      console.log("Problem in Bell icon");
      return;
    } else {
      ctx.body = { status: 200, message: "Updated Bell Icon", ack };
      console.log("Updated Bell Icon");
    }
  } catch (err) {
    console.log("Error while updating the bell icon", err);
  }
};

const makeUserPremium = async (ctx) => {
  try {
    const userId = ctx.user.userId;
    const ack = await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      [{ $set: { isPremium: { $not: "$isPremium" } } }],
      {
        returnDocument: "after",
      }
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
