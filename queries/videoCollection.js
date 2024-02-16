const { videoCollection } = require("../config/dbconfig");

const getAllVideos = async (condition) => {
  return await videoCollection.find(condition).toArray();
};
const getAllVideosFromAggreation = async (pipeline) => {
  return await videoCollection.aggregate(pipeline).toArray();
};

const updateVideo = async (videoId, condition) => {
  return await videoCollection.updateOne({ videoId: videoId }, condition);
};
module.exports = { getAllVideos, updateVideo, getAllVideosFromAggreation };
