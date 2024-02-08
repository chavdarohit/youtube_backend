const { suggestedCollection } = require("../config/dbconfig");

const getChannelCountFromId = async (channelId) => {
  return suggestedCollection
    .find({
      channelId: channelId,
    })
    .count();
};
const getAllChannels = async (condition, skip, limit, sort = {}) => {
  const channels = await suggestedCollection
    .find(condition)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .toArray();

  const totalCount = await suggestedCollection.countDocuments(condition);

  return { channels, totalCount };
};

module.exports = {
  getChannelCountFromId,
  getAllChannels,
};
