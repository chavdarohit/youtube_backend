const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { viewSubscribedChannel } = require("./data.controller");
const {
  getUserFromDbUsingId,
  getUsersFromDb,
  updateUser,
} = require("../queries/userCollection");

const { getAllChannels } = require("../queries/suggestedCollections");
const { userCollection } = require("../config/dbconfig");
require("dotenv").config();

const sendEmail = async (mailOptions) => {
  return new Promise((resolve, reject) => {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PSSD,
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

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
    subject: "Youtube Subsribe @SocialPilot",
    html: `
    <p>You have received an add friend request. Click the links below to accept or reject:</p>
    <a href='http://app.custom.local/sp/accept/invitation/${urlToken}'>Click here !!</a>
    `,
  };
  // Send the email
  try {
    const info = await sendEmail(mailOptions);
    ctx.body = {
      status: 200,
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
    let buddies = await getUsersFromDb(condition, projection);

    console.log("Buddies fetched succesfully");
    ctx.body = { status: 200, buddies };
  } catch (err) {
    ctx.body = { status: 204, message: "error while searching buddy" };
    console.log(" error while searching buddy");
  }
};

const addBuddy = async (ctx) => {
  const userId = ctx.state.user.userId;
  const buddyId = ctx.buddy.userId;
  console.log("user id ", userId, " buddy id ", buddyId);

  try {
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

    await userCollection.bulkWrite(operations);

    console.log("user id buddy id ", userId, buddyId);

    console.log("Buddies updated Succesfully");
    ctx.body = {
      status: 200,
      message: "Buddy added succesfully",
      user: ctx.buddy,
    };
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      error: "Unauthorized user - Bad Request from Buddy ",
    };
  }
};

const showBuddy = async (ctx) => {
  try {
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
    const buddies = await getUsersFromDb(condition, projection);

    console.log("Buddies fetched succesfully");
    if (buddies.length === 0) {
      ctx.body = { status: 204, buddies };
    } else {
      ctx.body = { status: 200, buddies };
    }
  } catch (err) {
    ctx.status = 201;
    ctx.body = "error showing buddys";
    console.log("error showing buddys ", err);
  }
};

// const buddyChannels = async (ctx) => {
//   try {
//     const user = await getUserFromDb(ctx);

//     // console.log("in buddies channel ", userId, user);
//     const isPremium = user.isPremium;
//     const buddyId = ctx.params.id;
//     ctx.user.userId = buddyId;
//     console.log("In buddies channel buddyid", buddyId, ctx.user.userId);

//  const result = await viewSubscribedChannel(ctx, isPremium, buddyId);
//     ctx.body = result;
//   } catch (err) {
//     (ctx.status = 201), (ctx.body = "error in showing buddies channel");
//     console.log("buddy channels ", err);
//   }
// };   // ->called viewSubscribed function because functionality is already made
//     // -> passing the ispremium for saying that current login person is premium or not then show channels as per that
//     // -> passing buddyid just to make decision that... if buddy id is not UNDEFINED then response should be returned otherwise from that function
//     // it will go to the client

    

const allChannels = async (ctx) => {
  const { _page, _limit } = ctx.query;

  const limit = parseInt(_limit) || 5;
  const page = parseInt(_page) || 1;
  const skip = (page - 1) * limit;

  try {
    // getting buddy ids from frontend from checkbox
    const buddyIdFromCheckbox = ctx.request.body?.buddyId ?? [];
    // console.log("Buddy id from checkbox ", buddyIdFromCheckbox);
    let buddyIds = [];

    const user = ctx.state.user;
    if (Array.isArray(buddyIdFromCheckbox) && buddyIdFromCheckbox.length > 0) {
      buddyIds = buddyIdFromCheckbox;
    } else {
      //array of all buddy ids if no one is selected from checkbox
      buddyIds = [...user.buddies, user.userId];
    }

    // console.log(buddyIds);
    let channelIds = [];

    const result = await userCollection
      .aggregate([
        { $match: { userId: { $in: buddyIds } } },
        {
          $unwind: "$channelsSubscribed",
        },
        {
          $group: {
            _id: null,
            channels: { $addToSet: "$channelsSubscribed.channelId" },
          },
        },
      ])
      .toArray();
      if (result.length > 0) {
        channelIds = result[0].channels;
      }
 
    let condition = {};
    condition.channelId = { $in: channelIds };
    if (!user.isPremium) {
      condition.isPremium = user.isPremium;
    }

    let { channels, totalCount } = await getAllChannels(condition, skip, limit);
    ctx.body = {
      status: 200,
      massage: "Channels Fetched Successfull",
      channels,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
    console.log("Channels Fetched Successfull ", channels.length);
  } catch (err) {
    ctx.status = 500;
    ctx.body = "something went wrong while fetching all channels";
    console.log("error in fetching all ", err);
  }
};

module.exports = {
  requestBuddy,
  searchBuddy,
  addBuddy,
  showBuddy,
  allChannels,
};
