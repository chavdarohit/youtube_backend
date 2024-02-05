const { suggestedCollection } = require("../config/dbconfig");

const getPremiumAndNonChannelsFromIds = async (channelIds, isUserPremium) => {
  return suggestedCollection
    .find({
      _id: { $in: channelIds },
      isPremium: isUserPremium,
    })
    .toArray();
};

const getAllChannelsFromIds = async (channelIds) => {
  return suggestedCollection
    .find({
      _id: { $in: channelIds },
    })
    .toArray();
};
const getAllChannels = async () => {
  return suggestedCollection.find({}).toArray();
};

const getChannelsBySearch = async (_searchTerm) => {
  return await suggestedCollection
    .find({
      channelName: new RegExp(_searchTerm, "i"),
    })
    .toArray();
};

module.exports = {
  getPremiumAndNonChannelsFromIds,
  getAllChannelsFromIds,
  getChannelsBySearch,
  getAllChannels,
};
