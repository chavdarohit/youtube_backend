const { getChannelCountFromId } = require("../queries/suggestedCollections");

const checkChannel = async (ctx, next) => {
  const channelId = ctx.params.id;
  try {
    const count = await getChannelCountFromId(channelId);
    if (!count) {
      ctx.status = 404;
      ctx.body = "No channel Found";
      console.log("No channel Found - Msg from checkChannel Middleware");
      return;
    }
    await next();
  } catch (err) {
    console.log(err);
  }
};
module.exports = checkChannel;
