const { videoInteraction } = require("../config/dbconfig");

const addRecord = async (data) => {
  return await videoInteraction.insertOne(data);
};

module.exports = { addRecord };
