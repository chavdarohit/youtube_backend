const { videoCollection } = require("../config/dbconfig");

const getAllVideos = async (condition) => {
  const videos = await videoCollection.find(condition).toArray();
  return videos;
};
module.exports = { getAllVideos };
