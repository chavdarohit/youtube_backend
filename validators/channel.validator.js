const channelPresentForSubscribe = (_, ctx) => {
  let err = null;

  if (channelPresent(ctx.params.id, ctx)) {
    err = { message: "Channel Already Subscribed", field: "channelId" };
    return err;
  }
  return null;
};

const channelPresentForUnsubscribe = (_, ctx) => {
  let err = null;

  if (!channelPresent(ctx.params.id, ctx)) {
    err = { message: "Channel Not Found for Unsubscribe", field: "channelId" };
    return err;
  }
  return null;
};

const channelPresentForBellIcon = (_, ctx) => {
  let err = null;

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
