const { pipeline } = require("nodemailer/lib/xoauth2");
const { videoCollection } = require("../config/dbconfig");
const {
  getAllVideos,
  getAllVideosFromAggreation,
} = require("../queries/videoCollection");
const { getDataFromAggregation } = require("../queries/userCollectionQueries");

const channelAnalytics = async (ctx) => {
  const channelId = ctx.params.id;

  let condition = {};
  if (channelId) {
    condition.uploadedBy = channelId;
  }
  const videoPipeline = [
    {
      $match: { uploadedBy: "0f16046a-9ab4-41f7-a9da-58f662eda481" },
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: "$totalLikes" },
        totalDislikes: { $sum: "$totalDislikes" },
        totalComments: { $sum: { $size: "$comments" } },
        videos: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalLikes: 1,
        totalComments: 1,
        totalDislikes: 1,
        videos: {
          $sortArray: { input: "$videos", sortBy: { totalLikes: -1 } },
        },
      },
    },
    {
      $project: {
        totalLikes: 1,
        totalDislikes: 1,
        totalComments: 1,
        videos: { $slice: ["$videos", 5] },
      },
    },
  ];

  const userPipeline = [
    {
      $match: {
        "channelsSubscribed.channelId": "406528b5-8896-4547-8673-ad433782d96b",
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
        newSubscribers: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalSubscribers: 1,
        totalfemale: 1,
        totalmale: 1,
        "0to20": 1,
        "20to40": 1,
        "40to60": 1,
        subscribers: {
          $sortArray: {
            input: "$newSubscribers",
            sortBy: { "channel.subscribedOn": -1 },
          },
        },
      },
    },
    {
      $project: {
        totalSubscribers: 1,
        totalfemale: 1,
        totalmale: 1,
        "0to20": 1,
        "20to40": 1,
        "40to60": 1,
        newSubscribers: { $slice: ["$subscribers", 5] },
      },
    },
  ];

  const videos = await getAllVideosFromAggreation(videoPipeline);
  const users = await getDataFromAggregation(userPipeline);

  ctx.status = 200;
  ctx.body = { videoAnalytics: videos[0], subscriberAnalytics: users[0] };
};
module.exports = { channelAnalytics };
