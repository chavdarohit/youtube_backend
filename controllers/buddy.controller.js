const nodemailer = require("nodemailer");
const { userCollection } = require("../dbacess");
require("dotenv").config();

const addBuddy = (ctx) => {
  console.log("Testing email");

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

  // Define the email content
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEMAIL,
    subject: "Youtube Subsribe @SocialPilot",
    text: "This is a test email !",
    html: `
    <p>You have received an add friend request. Click the links below to accept or reject:</p>
    <a href="">Click here !!</a>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const searchBuddy = async (ctx) => {
  let buddies;
  try {
    const { _searchTerm } = ctx.query;

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

module.exports = { addBuddy, searchBuddy };
