const { getAllVideosFromAggreation } = require("../queries/videoCollection");
const { getDataFromAggregation } = require("../queries/userCollectionQueries");

const videoAnalytics = async (ctx) => {
  const channelId = ctx.params.id;

  // if channelId will there then we will make the condition for doing query
  let condition = {};
  if (channelId) {
    condition.uploadedBy = channelId;
  }

  const top5videoPipeline = [
    {
      $match: {
        uploadedBy: channelId,
      },
    },
    {
      $sort: {
        totalLikes: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
  const videoPipeline = [
    {
      $match: { uploadedBy: channelId },
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: "$totalLikes" },
        totalDislikes: { $sum: "$totalDislikes" },
        totalComments: { $sum: { $size: "$comments" } },
      },
    },
  ];

  const videosAnlytics = await getAllVideosFromAggreation(videoPipeline);
  const videos = await getAllVideosFromAggreation(top5videoPipeline);

  ctx.status = 200;
  ctx.body = {
    videoAnalytics: videosAnlytics,
    top5videos: videos,
  };
};

const subscriberAnalytics = async (ctx) => {
  const channelId = ctx.params.id;

  let condition = {};
  if (channelId) {
    condition.uploadedBy = channelId;
  }

  const newSubscribersPipeline = [
    {
      $match: {
        "channelsSubscribed.channelId": channelId,
      },
    },
    {
      $project: {
        _id: 0,
        firstname: 1,
        lastname: 1,
        gender: 1,
        age: 1,
        channel: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$channelsSubscribed",
                as: "channel",
                cond: {
                  $eq: [
                    "$$channel.channelId",
                    "406528b5-8896-4547-8673-ad433782d96b",
                  ],
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $sort: {
        "channel.subscribedOn": -1,
      },
    },
    {
      $limit: 5,
    },
  ];

  const subscriberAnalyticsPipeline = [
    {
      $match: {
        "channelsSubscribed.channelId": channelId,
      },
    },
    {
      $group: {
        _id: null,
        totalSubscribers: {
          $sum: 1,
        },
        totalmale: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$gender", "m"],
              },
              then: 1,
              else: 0,
            },
          },
        },
        totalfemale: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$gender", "f"],
              },
              then: 1,
              else: 0,
            },
          },
        },
        "0to20": {
          $sum: {
            $cond: {
              if: {
                $and: [
                  {
                    $gt: ["$age", 0],
                  },
                  {
                    $lte: ["$age", 20],
                  },
                ],
              },
              then: 1,
              else: 0,
            },
          },
        },
        "20to40": {
          $sum: {
            $cond: {
              if: {
                $and: [
                  {
                    $gt: ["$age", 20],
                  },
                  {
                    $lte: ["$age", 40],
                  },
                ],
              },
              then: 1,
              else: 0,
            },
          },
        },
        "40to60": {
          $sum: {
            $cond: {
              if: {
                $and: [
                  {
                    $gt: ["$age", 40],
                  },
                  {
                    $lt: ["$age", 60],
                  },
                ],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ];

  const subscriberAnalytics = await getDataFromAggregation(
    subscriberAnalyticsPipeline
  );
  const newSubscribers = await getDataFromAggregation(newSubscribersPipeline);

  ctx.status = 200;
  ctx.body = {
    subscriberAnalytics,
    newSubscribers,
  };
};
module.exports = { subscriberAnalytics, videoAnalytics };
