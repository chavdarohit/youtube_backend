const channelPresentForSubscribe = (_, ctx) => {
  let err = null;

  if (!ctx.params.id) {
    err = { message: "Channel is Not valid", field: "channelId" };
    return err;
  }

  if (channelPresent(ctx.params.id, ctx)) {
    err = { message: "Channel Already Subscribed", field: "channelId" };
    return err;
  }
  return null;
};

const channelPresentForUnsubscribe = (_, ctx) => {
  let err = null;

  if (!ctx.params.id) {
    err = { message: "Channel is Not valid", field: "channelId" };
    return err;
  }

  if (!channelPresent(ctx.params.id, ctx)) {
    err = { message: "Channel Not Found for Unsubscribe", field: "channelId" };
    return err;
  }
  return null;
};

const channelPresentForBellIcon = (_, ctx) => {
  let err = null;

  if (!ctx.params.id) {
    err = { message: "Channel is Not valid", field: "channelId" };
    return err;
  }

  if (!channelPresent(ctx.params.id, ctx)) {
    err = {
      message: "Channel Not Found for Bell Notification",
      field: "channelId",
    };
    return err;
  }
  return null;
};

const channelPresent = (channelId, ctx) => {
  const user = ctx.state.user;

  //   console.log("user in channel present ", user);

  const channel = user.channelsSubscribed.find(
    (channel) => channel.channelId === channelId
  );

  if (channel) return true;
  return false;
};

module.exports = {
  channelPresentForSubscribe,
  channelPresentForUnsubscribe,
  channelPresentForBellIcon,
};
