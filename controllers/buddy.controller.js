const nodemailer = require("nodemailer");
const { userCollection, suggestedCollection } = require("../dbacess");
const jwt = require("jsonwebtoken");
const { viewSubscribedChannel } = require("./data.controller");
const getUser = require("../utils/getUser");
const getUserFromDb = require("../utils/getUser");
const { ObjectId } = require("mongodb");
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
  const userId = ctx.user.userId;
  const buddyId = ctx.request.body.buddyId;
  const buddyExists = await userCollection.findOne({
    userId: buddyId,
  });

  if (!buddyExists) {
    ctx.body = {
      status: 401,
      message: "Unauthorised Buddy Request",
    };
    return;
  } else {
    console.log("Buddy exists ...");
  }

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
    <a href='http://app.custom.local/accept/invitation/${urlToken}'>Click here !!</a>
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
  let buddies;
  console.log("buddy search called:");
  try {
    const { _searchTerm } = ctx.query;
    console.log("searchterm  ", _searchTerm);

    if (_searchTerm) {
      buddies = await userCollection
        .find(
          {
            $or: [
              { firstname: new RegExp(_searchTerm, "i") },
              {
                lastname: new RegExp(_searchTerm, "i"),
              },
            ],
          },
          {
            projection: {
              firstname: 1,
              lastname: 1,
              email: 1,
              userId: 1,
              image: 1,
              _id: 0,
            },
          }
        )
        .toArray();
    } else {
      buddies = await userCollection
        .find(
          {},
          {
            projection: {
              firstname: 1,
              lastname: 1,
              email: 1,
              userId: 1,
              image: 1,
              _id: 0,
            },
          }
        )
        .toArray();
    }
    console.log("Buddies fetched succesfully");
    ctx.body = { status: 200, buddies };
  } catch (err) {
    ctx.body = { status: 204, message: "error while searching buddy" };
    console.log(" error while searching buddy");
  }
};

const addBuddy = async (ctx) => {
  const buddytoken = ctx.request.body.token;
  const decision = ctx.request.body.decision;

  if (decision === "reject") {
    ctx.status = 201;
    ctx.body = {
      error: "Request adding buddy rejected",
    };
    return;
  }
  try {
    const { userId, buddyId } = jwt.verify(buddytoken, process.env.SECRET_KEY);
    // console.log("buddy token ", buddytoken);
    // console.log(
    //   "Buddy token verified userid =",
    //   userId,
    //   " Buddy id =",
    //   buddyId
    // );

    await userCollection.updateOne(
      {
        userId: userId,
      },
      {
        $addToSet: { buddies: buddyId },
      }
    );

    await userCollection.updateOne(
      {
        userId: buddyId,
      },
      {
        $addToSet: { buddies: userId },
      }
    );
    console.log("Buddies updated Succesfully");
    ctx.body = {
      status: 200,
      message: "Buddy added succesfully",
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
    const userId = ctx.user.userId;

    const user = await userCollection.findOne({
      userId: userId,
    });

    console.log("Show buddy channels ", user.buddies);

    const buddies = await userCollection
      .find({
        userId: { $in: user.buddies },
      })
      .toArray();

    console.log("Buddies fetched succesfully");
    if (buddies.length === 0) {
      ctx.body = { status: 204, buddies };
    } else {
      ctx.body = { status: 200, buddies };
    }
  } catch (err) {
    ctx.status = 201;
    ctx.body = "error showing buddys";
  }
};

const buddyChannels = async (ctx) => {
  try {
    const userId = ctx.user.userId;

    const user = await userCollection.findOne({
      userId: userId,
    });

    // console.log("in buddies channel ", userId, user);
    const isPremium = user.isPremium;
    const buddyId = ctx.params.id;
    ctx.user.userId = buddyId;
    console.log("In buddies channel buddyid", buddyId, ctx.user.userId);

    // ->called viewSubscribed function because functionality is already made
    // -> passing the ispremium for saying that current login person is premium or not then show channels as per that
    // -> passing buddyid just to make decision that... if buddy id is not UNDEFINED then response should be returned otherwise from that function
    // it will go to the client

    const result = await viewSubscribedChannel(ctx, isPremium, buddyId);
    ctx.body = result;
  } catch (err) {
    (ctx.status = 201), (ctx.body = "error in showing buddies channel");
    console.log("buddy channels ", err);
  }
};

const allChannels = async (ctx) => {
  try {
    //gtting buddy ids from frontend from checkbox
    const buddyIdFromCheckbox = ctx.request.body?.buddyId ?? [];

    let buddyIds = [];
    const user = await getUser(ctx);
    if (Array.isArray(buddyIdFromCheckbox) && buddyIdFromCheckbox.length > 0) {
      buddyIds = buddyIdFromCheckbox;
    } else {
      //array of all buddy ids if no one is selected from checkbox
      buddyIds = [...user.buddies, user.userId];
    }
    // console.log("buddyids", buddyIds);
    let channelIds = [];

    //fetching all the channels from the suggested collection with their id

    for (let element of buddyIds) {
      ctx.user.userId = element;
      const user = await getUserFromDb(ctx);
      //pushing all the channels of each buddy into single array
      channelIds.push(
        ...user.channelsSubscribed.map((item) => item.id.toString())
      );
    }
    channelIds = [...new Set(channelIds)]; // removing duplicate channels

    //converting again to the Object id for finding from  the database
    channelIds = channelIds.map((id) => new ObjectId(id));

    //if user is not premium it will fetch only normal channels
    const isUserPremium = user.isPremium;

    console.log("Channels ids ", channelIds);
    let channels = [];
    if (!isUserPremium) {
      channels = await suggestedCollection
        .find({
          _id: { $in: channelIds },
          isPremium: isUserPremium,
        })
        .toArray();
    } else {
      channels = await suggestedCollection
        .find({
          _id: { $in: channelIds },
        })
        .toArray();
    }
    ctx.body = {
      status: 200,
      massage: "Channels Fetched Successfull",
      channels,
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
  buddyChannels,
  allChannels,
};
