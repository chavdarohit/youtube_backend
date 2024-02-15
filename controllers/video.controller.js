const { getAllVideos } = require("../queries/videoCollection");

const videoList = async (ctx) => {
  let { channelId, title, tags } = ctx.query;
  let condition = {};
  try {
    if (channelId) {
      condition.uploadedBy = channelId;
    }
    if (title) {
      condition.videoTitle = new RegExp(title, "i");
    }
    if (tags) {
      console.log(tags);
      condition.tags = new RegExp(tags, "i");
    }
    const list = await getAllVideos(condition);
    console.log(
      "videos list fetched by ",
      ctx.state.user.firstname,
      ctx.state.user.lastname
    );
    ctx.status = 200;
    ctx.body = list;
  } catch (err) {
    ctx.status = 401;
    ctx.body = "no videos found";
  }
};
module.exports = { videoList };
