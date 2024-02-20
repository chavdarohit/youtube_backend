const { videoInteraction } = require("../config/dbconfig");
const { getAllVideos } = require("../queries/videoCollection");

const alreadyvideoPresent = async (_, ctx) => {
  let err = null;

  if (!ctx.params.videoId) {
    err = { message: "No video Found ", field: "videoId" };
    return err;
  }

  if (await videoPresent(ctx.params.videoId, ctx)) {
    if (ctx.originalUrl.includes("like"))
      err = { message: "video Already Liked", field: "videoId" };

    if (ctx.originalUrl.includes("dislike"))
      err = { message: "video Already Disliked", field: "videoId" };
    return err;
  }
  return err;
};

const videoPresent = async (videoId, ctx) => {
  const userId = ctx.state.user.userId;
  let video;

  if (ctx.originalUrl.includes("like")) {
    console.log("in like");
    video = await videoInteraction.findOne({
      userId,
      videoId,
      status: "liked",
    });
  }

  if (ctx.originalUrl.includes("dislike")) {
    console.log("in dislike");
    video = await videoInteraction.findOne({
      userId,
      videoId,
      status: "disliked",
    });
  }
  if (video) return true;
  return false;
};

const videoExists = async (_, ctx) => {
  let err = null;
  let condition = {
    videoId: ctx.params.videoId,
  };
  const video = await getAllVideos(condition);

  if (!video) {
    err = { message: "No video Found", field: "videoId" };
    return err;
  }
  return err;
};

module.exports = { alreadyvideoPresent, videoExists };
