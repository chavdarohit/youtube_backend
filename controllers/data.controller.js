const {
  updateUserChannelBellIconStatus,
  updateUserToPremium,
  subscribeUnsubscribe,
  updateUser,
} = require("../queries/userCollection");
const { getAllChannels } = require("../queries/suggestedCollections");

async function viewProfile(ctx) {
  const user = ctx.state.user;
  console.log("User id in view profile ", user.firstname);
  if (!user) {
    ctx.status = 404;
    ctx.body = "User Not found";
    console.log("User not found in Db");
    return;
  }

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
    // console.log("Filtered ", channels);
    let { channels, totalCount } = await getAllChannels(condition, skip, limit);

    ctx.body = {
      status: 200,
      channels,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (err) {
    ctx.body = {
      status: 500,
      massage: "Internal server error",
    };
    console.log("error while suggesting channels", err);
  }
}

async function subscribeChannel(ctx) {
  const userId = ctx.state.user.userId;
  const channelId = ctx.params.id;
  console.log("user id ", userId, " channel id ", channelId);
  try {
    let condition = {
      $addToSet: {
        channelsSubscribed: { channelId: channelId, isbell: false },
      },
    };
    const ack = await updateUser(userId, condition);
    if (ack.modifiedCount === 0 && ack.matchedCount === 1) {
      ctx.body = {
        status: 204,
        massage: "Channel Already Subscribed",
      };
      console.log("Channel Already Subscribed");
      return;
    }
    ctx.body = {
      status: 200,
      massage: "Channel Subscribed",
    };
    console.log("Channel Subscribed");
  } catch (err) {
    console.error("Error Subscribing channel:", err);
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
    const ack = await updateUser(userId, condition);
    if (ack.modifiedCount === 0 && ack.matchedCount === 1) {
      ctx.body = {
        status: 204,
        massage: "Channel Unsubscribed Succesfully",
      };
      console.log("Channel Unsubscribed Succesfully");
      return;
    }
    ctx.body = {
      status: 200,
      massage: "Channel Unsubscribed",
    };
    console.log("Channel Unsubscribed");
  } catch (err) {
    console.error("Error unsubscring channel:", err);
    ctx.body = {
      status: 401,
      massage: "There is something wrong while Unsubscribe",
    };
  }
}

async function viewSubscribedChannel(ctx, buddyisPremium, buddyId) {
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

    let { channels, totalCount } = await getAllChannels(
      condition,
      skip,
      limit,
      sort
    );
    console.log("view channel subscribed ", sort);

    // if (!buddyisPremium || !userisPremium) {
    //   channels = channels.filter((item) => item.isPremium === false);
    //   console.log("buddy is not premium");
    // }

    if (channels.length === 0) {
      //if buddy id is there then return to buddy controller for response
      //otherwise send response from here
      // if (buddyId) return { status: 204, channels };
      console.log("no channels found");
      ctx.body = { status: 204, channels };
    } else {
      // if (buddyId) return { status: 200, channels };
      console.log("All subscribed channels");
      ctx.body = {
        status: 200,
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

  try {
    //getting the value from the db of the bellicon true or false . ??
    const channel = await user.channelsSubscribed.find(
      (obj) => obj.channelId === channelId
    );
    console.log("Bell is ", channel.isbell);
    const bell = channel.isbell ? false : true;

    //base on the previous state the bell icon is getting updated
    const updateBellack = await updateUserChannelBellIconStatus(
      user.userId,
      channelId,
      bell
    );
    if (updateBellack.modifiedCount === 0) {
      ctx.body = { status: 204, message: "No channel found for bell icon" };
      console.log("Problem in Bell icon");
      return;
    }

    ctx.body = {
      status: 200,
      message: bell
        ? "You will recieve Notifications"
        : "Notification Disabled",
    };
    console.log("Updated Bell Icon");
  } catch (err) {
    ctx.body = {
      status: 500,
      message: "Error while updating the bell icon",
    };
    console.log("Error while updating the bell icon", err);
  }
};

const makeUserPremium = async (ctx) => {
  try {
    const userId = ctx.user.userId;
    const ack = await updateUserToPremium(userId); // console.log("ack ", ack);
    if (ack) {
      console.log("User account Upgraded");
      ctx.body = {
        status: 200,
        message: ack.isPremium
          ? "User updated to Premium"
          : "User downgrade to Normal ",
        user: ack,
      };
    }
  } catch (err) {
    ctx.body = { status: 201, message: "Error making premium" };
    console.log("Error making premium", err);
  }
};

const updateprofile = async (ctx) => {
  let { firstname, lastname, password, email, mobile, gender, bday } =
    ctx.request.body;
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
