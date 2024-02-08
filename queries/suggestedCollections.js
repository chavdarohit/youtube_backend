const { suggestedCollection } = require("../config/dbconfig");

// const getPremiumAndNonChannelsFromIds = async (channelIds, isUserPremium) => {
//   return suggestedCollection
//     .find({
//       _id: { $in: channelIds },
//       isPremium: isUserPremium,
//     })
//     .toArray();
// };

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

const getChannelsBySearch = async (_searchTerm) => {
  return await suggestedCollection
    .find({
      channelName: new RegExp(_searchTerm, "i"),
    })
    .toArray();
};

module.exports = {
  getChannelCountFromId,
  getChannelsBySearch,
  getAllChannels,
};
