const userCollectionQueries = require("../queries/userCollectionQueries");
const addBuddyMail = require("../utils/addBuddyMail");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const requestBuddy = async (ctx) => {
  const userId = ctx.state.user.userId;

  //getting buddy from the checkBuddy middleware
  const buddyExists = ctx.buddy;
  const buddyId = ctx.buddy.userId;

  console.log("Buddy exists ...");

  const urlToken = jwt.sign({ userId, buddyId }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
  if (urlToken) console.log("Url token generated");

  // Define the email content
  const mailOptions = {
    from: process.env.EMAIL,
    to: buddyExists.email,
    subject: "Youtube Subscribe @SocialPilot",
    html: `
    <p>You have received an add friend request. Click the links below to accept or reject:</p>
    <a href='http://app.custom.local/sp/accept/invitation/${urlToken}'>Click here !!</a>
    `,
  };
  // Send the email
  try {
    const info = await addBuddyMail.sendEmail(mailOptions);
    ctx.status = 200;
    ctx.body = {
      message: "Email sent Succesfully",
      token: urlToken,
    };
    console.log("Email sent:", info.response);
  } catch (err) {
    ctx.body = {
      status: 403,
      message: "Can't send Email",
    };
    console.error("There is problem in sending mail:", err);
  }
};

const searchBuddy = async (ctx) => {
  try {
    const { _searchTerm } = ctx.query;
    console.log("searchterm  ", _searchTerm);

    let condition = {};
    let projection = {
      projection: {
        firstname: 1,
        lastname: 1,
        email: 1,
        userId: 1,
        image: 1,
        _id: 0,
      },
    };

    if (_searchTerm) {
      condition.$or = [
        { firstname: new RegExp(_searchTerm, "i") },
        {
          lastname: new RegExp(_searchTerm, "i"),
        },
      ];
    }
    let buddies = await userCollectionQueries.getUsersFromDb(
      condition,
      projection
    );

    console.log("Buddies fetched succesfully", buddies);
    ctx.status = 200;
    ctx.body = { buddies };
  } catch (err) {
    ctx.body = { status: 204, message: "error while searching buddy" };
    console.log(" error while searching buddy");
  }
};

const addBuddy = async (ctx) => {
  const userId = ctx.state.user.userId;
  const buddyId = ctx.buddy.userId;

  console.log("user id ", userId, " buddy id ", buddyId);

  const operations = [
    {
      updateOne: {
        filter: { userId: userId },
        update: { $addToSet: { buddies: buddyId } },
      },
    },
    {
      updateOne: {
        filter: { userId: buddyId },
        update: { $addToSet: { buddies: userId } },
      },
    },
  ];

  await userCollectionQueries.bulkWriteInDb(operations);

  console.log("Buddies updated Succesfully");
  (ctx.status = 200),
    (ctx.body = {
      message: "Buddy added succesfully",
      user: ctx.buddy,
    });
};

const showBuddy = async (ctx) => {
  const user = ctx.state.user;

  console.log("Show buddy ", user.buddies);

  let condition = {
    userId: { $in: user.buddies },
  };
  let projection = {
    projection: {
      firstname: 1,
      lastname: 1,
      email: 1,
      userId: 1,
      image: 1,
      _id: 0,
    },
  };
  const buddies = await userCollectionQueries.getUsersFromDb(
    condition,
    projection
  );

  console.log("Buddies fetched succesfully");
  if (buddies.length === 0) {
    ctx.body = { status: 204, buddies };
  } else {
    ctx.body = { status: 200, buddies };
  }
};

const allChannels = async (ctx) => {
  const { _page, _limit } = ctx.query;

  const limit = parseInt(_limit) || 5;
  const page = parseInt(_page) || 1;
  const skip = (page - 1) * limit;

  // getting buddy ids from frontend from checkbox
  const buddyIdFromCheckbox = ctx.request.body?.buddyId ?? [];
  let buddyIds = [];

  const user = ctx.state.user;
  if (Array.isArray(buddyIdFromCheckbox) && buddyIdFromCheckbox.length > 0) {
    buddyIds = buddyIdFromCheckbox;
  } else {
    //array of all buddy ids if no one is selected from checkbox
    buddyIds = [...user.buddies, user.userId];
  }

  const pipeline = [
    {
      $match: {
        userId: {
          $in: buddyIds,
        },
      },
    },
    {
      $lookup: {
        from: "suggested",
        localField: "channelsSubscribed.channelId",
        foreignField: "channelId",
        as: "suggestedChannels",
      },
    },
    {
      $unwind: "$suggestedChannels",
    },
    {
      $group: {
        _id: null,
        channels: { $addToSet: "$suggestedChannels" },
      },
    },
    {
      $project: {
        _id: 0,
        channels: {
          $filter: {
            input: "$channels",
            as: "channel",
            cond: {
              $cond: {
                if: { $eq: [user.isPremium, true] },
                then: "$$channel",
                else: {
                  $cond: {
                    if: { $eq: [user.isPremium, false] },
                    then: {
                      $cond: {
                        if: { $eq: ["$$channel.isPremium", false] },
                        then: "$$channel",
                        else: null,
                      },
                    },
                    else: null,
                  },
                },
              },
            },
          },
        },
        totalCount: { $size: "$channels" },
      },
    },
    {
      $project: {
        _id: 0,
        channels: { $slice: ["$channels", skip, limit] },
        totalCount: 1,
      },
    },
  ];
  const result = await userCollectionQueries.getDataFromAggregation(pipeline);

  console.log("resut ", result);
  ctx.body = {
    status: 200,
    channels: result[0].channels,
    totalCount: result[0].totalCount,
    totalPages: Math.ceil(result[0].totalCount / limit),
  };
};

const mutualBuddy = async (ctx) => {
  //find which buddy had subscribed the same channel
  const channelId = ctx.params.id;
  const user = ctx.state.user;
  const { isbell } = ctx.query;

  try {
    let matchStage;
    if (isbell === "true" || isbell === "false") {
      matchStage = {
        $match: {
          channelsSubscribed: {
            $elemMatch: {
              channelId: channelId,
              isbell: isbell === "true" ? true : false,
            },
          },
        },
      };
    } else {
      matchStage = {
        $match: { "channelsSubscribed.channelId": channelId },
      };
    }
    const pipeline = [
      {
        $match: { userId: { $in: user.buddies } },
      },
      matchStage,
    ];
    const buddy = await userCollectionQueries.getDataFromAggregation(
      pipeline,
      "mutualbuddy"
    );
    ctx.status = 200;
    ctx.body = {
      buddy: buddy,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  requestBuddy,
  mutualBuddy,
  searchBuddy,
  addBuddy,
  showBuddy,
  allChannels,
};
