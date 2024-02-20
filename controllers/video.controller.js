const { updateUser } = require("../queries/userCollectionQueries");
const { getAllVideos, updateVideo } = require("../queries/videoCollection");
const { addRecord } = require("../queries/videoInteractionQueries");

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
const videoLike = async (ctx) => {
  // console.log("in video like");
  const { videoId } = ctx.params;
  try {
    let videoCondition = {};
    if (videoId) {
      videoCondition.$inc = { totalLikes: 1 };
    }
    await addRecord({
      userId: ctx.state.user.userId,
      videoId,
      on: new Date(),
      status: "liked",
    });

    await updateVideo(videoId, videoCondition);

    ctx.status = 200;
    ctx.body = "Video Liked";
    console.log(
      "video Liked by ",
      ctx.state.user.firstname,
      ctx.state.user.lastname
    );
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
};
const videoDislike = async (ctx) => {
  const { videoId } = ctx.params;
  try {
    let videoCondition = {};
    if (videoId) {
      videoCondition.$inc = { totalDislikes: 1 };
    }

    await addRecord({
      userId: ctx.state.user.userId,
      videoId,
      on: new Date(),
      status: "disliked",
    });

    // await updateUser(ctx.state.user.userId, userCondition);
    await updateVideo(videoId, videoCondition);

    ctx.status = 200;
    ctx.body = "Video Disliked";
    console.log(
      "video Disliked by ",
      ctx.state.user.firstname,
      ctx.state.user.lastname
    );
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
};
const videoComment = async (ctx) => {
  // console.log("in video comment");
  const { comment } = ctx.request.body;
  const videoId = ctx.params.id;

  try {
    let condition = {};
    if (comment) {
      condition.$addToSet = { comments: comment };
    }
    await updateVideo(videoId, condition);

    ctx.status = 200;
    ctx.body = "comment sucessfull";
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal server Error";
  }
};

module.exports = { videoList, videoLike, videoDislike, videoComment };
