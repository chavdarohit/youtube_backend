const { getAllVideos } = require("../queries/videoCollection");

const alreadyvideoPresent = async (_, ctx) => {
  let err = null;

  if (!ctx.params.videoId) {
    err = { message: "No video Found ", field: "videoId" };
    return err;
  }

  if (videoPresent(ctx.params.videoId, ctx)) {
    if (ctx.originalUrl.includes("like"))
      err = { message: "video Already Liked", field: "videoId" };

    if (ctx.originalUrl.includes("dislike"))
      err = { message: "video Already Disliked", field: "videoId" };
    return err;
  }
  return err;
};

const videoPresent = (videoId, ctx) => {
  const user = ctx.state.user;
  let video;

  if (ctx.originalUrl.includes("like")) {
    video = user.videoLiked.find((id) => {
      return id === videoId;
    });
  }

  if (ctx.originalUrl.includes("dislike")) {
    video = user.videoDisliked.find((id) => {
      return id === videoId;
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
