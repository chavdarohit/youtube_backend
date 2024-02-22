const {
  updateUserToPremium,
  updateUser,
  getUserFromDbUsingId,
  getDataFromAggregation,
} = require("../queries/userCollectionQueries");
const suggestedCollectionsQueries = require("../queries/suggestedCollections");
const userCollectionQueries = require("../queries/userCollectionQueries");

async function viewProfile(ctx) {
  const user = ctx.state.user;
  console.log("User id in view profile ", user.firstname);
  ctx.body = {
    status: 200,
    user,
  };
  console.log("View Profile succesfully");
}

async function suggestedChannels(ctx) {
  const { _limit, _page, _searchTerm } = ctx.query;
  const user = await ctx.state.user;

  const limit = parseInt(_limit) || 10;
  const page = parseInt(_page) || 1;
  const skip = (page - 1) * limit;

  try {
    let condition = {};
    if (_searchTerm) condition.channelName = new RegExp(_searchTerm, "i");
    if (!user.isPremium) condition.isPremium = user.isPremium;

    // This is the subscribed channel already subscribe by user
    const userschannel = await user.channelsSubscribed.map(
      (obj) => obj.channelId
    );
    //filtering and removing channels which is already subscribed by the user
    if (userschannel.length) {
      condition.channelId = { $nin: userschannel };
    }

    let { channels, totalCount } =
      await suggestedCollectionsQueries.getAllChannels(condition, skip, limit);

    ctx.status = 200;
    ctx.body = {
      channels,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (err) {
    ctx.body = {
      status: 500,
      massage: "Internal server error",
    };
  }
}

async function subscribeChannel(ctx) {
  const userId = ctx.state.user.userId;
  const channelId = ctx.params.id;
  console.log("user id ", userId, " channel id ", channelId);
  try {
    let condition = {
      $addToSet: {
        channelsSubscribed: {
          channelId: channelId,
          isbell: false,
          subscribedOn: new Date(),
        },
      },
    };
    await userCollectionQueries.updateUser(userId, condition);

    (ctx.status = 200), (ctx.body = "Channel Subscribed");
    console.log("Channel Subscribed");
  } catch (err) {
    ctx.body = {
      status: 401,
      massage: "There is something wrong while subscribe",
    };
  }
}

async function unsubscribeChannel(ctx) {
  const userId = ctx.state.user.userId;
  const channelId = ctx.params.id;
  console.log("user id ", userId, " channel id ", channelId);
  try {
    let condition = {
      $pull: {
        channelsSubscribed: { channelId: channelId },
      },
    };
    await userCollectionQueries.updateUser(userId, condition);
    (ctx.status = 200), (ctx.body = "Channel Unsubscribed");
    console.log("Channel Unsubscribed");
  } catch (err) {
    console.error("Error unsubscring channel:", err);
    ctx.body = {
      status: 401,
      massage: "There is something wrong while Unsubscribe",
    };
  }
}

async function viewSubscribedChannel(ctx) {
  try {
    const user = ctx.state.user;
    const { _name, _subscribers, _page, _limit } = ctx.query;

    const limit = parseInt(_limit) || 5;
    const page = parseInt(_page) || 1;
    const skip = (page - 1) * limit;

    //taken the ids of the subscribed array into another array
    const ids = user.channelsSubscribed.map((item) => item.channelId);

    // fetching th items from the all channels and selecting that where the user has subscribed
    let condition = {};
    condition.channelId = { $in: ids };
    if (!user.isPremium) condition.isPremium = user.isPremium;

    let sort = {};
    if (_name) {
      if (_name === "asc") sort.channelName = 1;
      if (_name === "desc") sort.channelName = -1;
    }
    if (_subscribers) {
      if (_subscribers === "asc") sort.subscribersCount = 1;
      if (_subscribers === "desc") sort.subscribersCount = -1;
    }

    let { channels, totalCount } =
      await suggestedCollectionsQueries.getAllChannels(
        condition,
        skip,
        limit,
        sort
      );

    if (channels.length === 0) {
      console.log("no channels found");
      ctx.status = 204;
      ctx.body = channels;
    } else {
      ctx.body = 200;
      ctx.body = {
        channels,
        totalPages: Math.ceil(totalCount / limit),
      };
    }
  } catch (err) {
    console.log("Error viewing channel subscribed", err);
    ctx.body = {
      status: 500,
      channels: [],
      massage: "Error viewing channel subscribed",
    };
  }
}

const pressBellIcon = async (ctx) => {
  const user = ctx.state.user;
  const channelId = ctx.params.id;
  console.log("user id :", user.userId, " channel id :", channelId);

  //getting the value from the db of the bellicon true or false . ??
  const channel = await user.channelsSubscribed.find(
    (obj) => obj.channelId === channelId
  );
  console.log("Bell is ", channel.isbell);
  const bell = channel.isbell ? false : true;

  //base on the previous state the bell icon is getting updated
  await userCollectionQueries.updateUserChannelBellIconStatus(
    user.userId,
    channelId,
    bell
  );

  ctx.status = 200;
  ctx.body = {
    message: bell ? "You will recieve Notifications" : "Notification Disabled",
  };
  console.log("Updated Bell Icon");
};

const makeUserPremium = async (ctx) => {
  const userId = ctx.state.user.userId;
  const ack = await userCollectionQueries.updateUserToPremium(userId);
  console.log("ack ", ack);
  if (ack) {
    console.log("User account Upgraded");
    ctx.status = 200;
    ctx.body = {
      message: ack.isPremium
        ? "User updated to Premium"
        : "User downgrade to Normal",
      user: ack,
    };
  }
};

const updateprofile = async (ctx) => {
  let { firstname, lastname, mobile, gender, bday, age } = ctx.request.body;

  let condition = {
    $set: {
      firstname,
      lastname,
      mobile,
      gender,
      birthdate: bday,
      age,
    },
  };

  await userCollectionQueries.updateUser(ctx.state.user.userId, condition);
  const updatedUser = await userCollectionQueries.getUserFromDbUsingId(
    ctx.state.user.userId
  );
  ctx.status = 200;
  ctx.body = {
    message: "User Profile Updated Succesfully",
    user: updatedUser,
  };
  console.log("User Profile Updated Succesfully");
};

module.exports = {
  updateprofile,
  viewProfile,
  suggestedChannels,
  subscribeChannel,
  unsubscribeChannel,
  viewSubscribedChannel,
  pressBellIcon,
  makeUserPremium,
};
