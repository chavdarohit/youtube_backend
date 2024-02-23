const { videoInteraction } = require("../config/dbconfig");

const addRecord = async (data) => {
  return await videoInteraction.insertOne(data);
};

const findVideo = async (data) => {
  return await videoInteraction.findOne(data);
};

module.exports = { addRecord, findVideo };
