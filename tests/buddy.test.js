const userCollectionQueries = require("../queries/userCollectionQueries");
const makeJwtToken = require("../utils/MakeAuthToken");
const request = require("./request");
const addBuddyMail = require("../utils/addBuddyMail");
const makeJwt = require("jsonwebtoken");

const jwt = makeJwtToken("8db871d4-9413-4437-a49b-5847c46275df");
const anotherJwt = makeJwtToken("0984eeaa-7c28-423c-8a35-231a3ff3b0f5");

const urlTokenAddBuddy = makeJwt.sign(
  {
    userId: "8db871d4-9413-4437-a49b-5847c46275df",
    buddyId: "2f74a2f7-93bd-4318-b1b4-dcea2cb0efb1",
  },
  process.env.SECRET_KEY,
  {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  }
);
const urlTokenwrong = makeJwt.sign(
  {
    userId: "8db871d4-9413-4437-a49b-5847c46275df",
    buddyId: "123456",
  },
  process.env.SECRET_KEY,
  {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  }
);
const urlTokenCorrect = makeJwt.sign(
  {
    userId: "8db871d4-9413-4437-a49b-5847c46275df",
    buddyId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
  },
  process.env.SECRET_KEY,
  {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  }
);

describe("Buddy testings", () => {
  let user = {
    firstname: "manojdey",
    lastname: "chavda",
    password: "$2a$10$7A7DYxLdYGP.9IFZlmnOHOJsWLoH.XIeSx/RNGRlYfwB4tuMFPyyC",
    email: "test@example.com",
    mobile: "7878776207",
    gender: "m",
    bday: "2000-12-8",
    age: 23,
    image:
      "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
    isPremium: false,
    channelsSubscribed: [
      {
        channelId: "0f16046a-9ab4-41f7-a9da-58f662eda481",
        isbell: false,
        subscribedOn: "2024-02-22T10:26:23.543Z",
      },
      {
        channelId: "ef221f28-8faa-4b19-b02e-7f404544ac59",
        isbell: true,
        subscribedOn: "2024-02-22T10:26:23.543Z",
      },
    ],
    buddies: ["0984eeaa-7c28-423c-8a35-231a3ff3b0f5"],
    userId: "8db871d4-9413-4437-a49b-5847c46275df",
  };
  let userAnother = {
    firstname: "Parth",
    lastname: "barot",
    password: "$2a$10$7A7DYxLdYGP.9IFZlmnOHOJsWLoH.XIeSx/RNGRlYfwB4tuMFPyyC",
    email: "testanother@example.com",
    mobile: 7878776207,
    gender: "m",
    bday: "2000-12-8",
    age: 23,
    image:
      "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
    isPremium: true,
    channelsSubscribed: [],
    buddies: [],
    userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
  };
  let thirdUser = {
    _id: {
      $oid: "65c34d84c7c22dbdcbb7adfe",
    },
    firstname: "rohit",
    lastname: "chavda",
    password: "$2b$10$X.c6tRs3TK1furKPUNeGvOOeo5hjr.vx4kBBEWh6QvSb85VM6BDWa",
    email: "rohitchavda@gmailya.com",
    mobile: 123456890,
    gender: "m",
    birthdate: "2000-12-08",
    age: null,
    image: null,
    isPremium: false,
    channelsSubscribed: [
      {
        channelId: "406528b5-8896-4547-8673-ad433782d96b",
        isbell: false,
        subscribedOn: {
          $date: "2024-02-16T11:11:22.137Z",
        },
      },
    ],
    buddies: [],
    userId: "2f74a2f7-93bd-4318-b1b4-dcea2cb0efb1",
    videoDisliked: [],
    videoLiked: [],
  };
  let buddyData = [
    {
      _id: {
        $oid: "65c3489ffede69842a7137d1",
      },
      firstname: "manojdey",
      lastname: "chavda",
      password: "$2b$10$cJMS4jMVVgu6Iyrf/ddjtOKMaGFfAAi3JY6f5um/U0dCxjZYBEU6O",
      email: "barotpratham30@gmail.com",
      mobile: "7878776207",
      gender: "m",
      birthdate: "2000-12-8",
      age: 23,
      image:
        "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0feyfi9d2i7wc9.jpg",
      isPremium: true,
      channelsSubscribed: [
        {
          channelId: "406528b5-8896-4547-8673-ad433782d96b",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T11:09:17.447Z",
          },
        },
      ],
      buddies: [
        "efe79206-ff32-4e61-9241-a55d79d94c15",
        "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      ],
      userId: "8db871d4-9413-4437-a49b-5847c46275df",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c34952fede69842a7137d2",
      },
      firstname: "Parth",
      lastname: "Barot",
      password: "$2b$10$pmjHwdkIKYfyuED.jUVE0eP3V/bvSUbPJFMMrqWKRIVZnvOYw.6Hy",
      email: "barotpratham266@gmail.com",
      mobile: "9875323333",
      gender: "m",
      birthdate: "2000-08-08",
      age: 23,
      image:
        "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707297103/cqn28val4owugtnxqser.png",
      isPremium: true,
      channelsSubscribed: [
        {
          channelId: "c35e1adb-aa6f-43e9-90f7-4ca1757891e0",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T10:49:53.170Z",
          },
        },
        {
          channelId: "0f16046a-9ab4-41f7-a9da-58f662eda481",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T10:50:47.631Z",
          },
        },
        {
          channelId: "ef221f28-8faa-4b19-b02e-7f404544ac59",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T10:51:07.462Z",
          },
        },
        {
          channelId: "1ae3af65-5df6-4654-89e1-4299f7583b71",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T10:51:17.686Z",
          },
        },
        {
          channelId: "406528b5-8896-4547-8673-ad433782d96b",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T10:51:35.267Z",
          },
        },
      ],
      buddies: [
        "efe79206-ff32-4e61-9241-a55d79d94c15",
        "809fd2aa-bc99-4e66-a14f-a4daa4d69dfc",
        "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      ],
      userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      videoDisliked: ["a9725606-f001-4f37-82dc-cfaeaa10aaff"],
      videoLiked: [
        "a9725606-f001-4f37-82dc-cfaeaa10aaff",
        "c72f32ff-f50a-433c-9238-833bf4bec159",
      ],
    },
    {
      _id: {
        $oid: "65c349d949e8a87abeb8e3f3",
      },
      firstname: "PrathamSP",
      lastname: "Idar",
      password: "$2b$10$U4QjjZmph7yQ7L3lBgNRFeKDBslKdA28piH5rI5KeE3ngIBC4jmAi",
      email: "barotpratham862003@gmail.com",
      mobile: "7894561237",
      gender: "m",
      birthdate: "1978-09-09",
      age: 45,
      image:
        "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707297235/u3jh1qzwulk9rrxkfk9c.png",
      isPremium: false,
      channelsSubscribed: [
        {
          channelId: "406528b5-8896-4547-8673-ad433782d96b",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T11:10:42.444Z",
          },
        },
      ],
      buddies: ["0984eeaa-7c28-423c-8a35-231a3ff3b0f5"],
      userId: "efe79206-ff32-4e61-9241-a55d79d94c15",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c34d84c7c22dbdcbb7adfe",
      },
      firstname: "rohit",
      lastname: "chavda",
      password: "$2b$10$X.c6tRs3TK1furKPUNeGvOOeo5hjr.vx4kBBEWh6QvSb85VM6BDWa",
      email: "rohitchavda@gmailya.com",
      mobile: 123456890,
      gender: "m",
      birthdate: "2000-12-08",
      age: null,
      image: null,
      isPremium: false,
      channelsSubscribed: [
        {
          channelId: "406528b5-8896-4547-8673-ad433782d96b",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T11:11:22.137Z",
          },
        },
      ],
      buddies: [],
      userId: "2f74a2f7-93bd-4318-b1b4-dcea2cb0efb1",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c3598ffe9afddfdaf953c6",
      },
      firstname: "rohit",
      lastname: "chavda",
      password: "$2b$10$Dt/IUbarSGbKo9VoDlzOz.DuvlQN8xhCBSABNcfXBeSIFwUNJt.nu",
      email: "rohitchavda24@gmailya.com",
      mobile: 1234567890,
      gender: "m",
      birthdate: "2000-12-08",
      age: null,
      image: null,
      isPremium: false,
      channelsSubscribed: [
        {
          channelId: "406528b5-8896-4547-8673-ad433782d96b",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T11:12:10.264Z",
          },
        },
      ],
      buddies: [],
      userId: "fc96e7d5-4ef7-469b-838f-24f2909623d8",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c37f02ff05b2287e86dde9",
      },
      firstname: "rohit",
      lastname: "chavda",
      password: "$2b$10$TOVFWdYrj65k3DTF/0f2weyRhGSDtohLPcBFJ92K4.5qanRJ2.0Ya",
      email: "rohitchavda24@gmailya.com",
      mobile: 1234567890,
      gender: "m",
      birthdate: "2000-12-08",
      age: null,
      image: null,
      isPremium: false,
      channelsSubscribed: [],
      buddies: [],
      userId: "36f868f4-f1cb-49bf-8bf2-76eebf9acfdc",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c38104cdf4fd7846904320",
      },
      firstname: "true",
      lastname: "rohit",
      password: "$2b$10$lcQJfa/xOBf5CUdWre4tsOBgNpN04K7sH9YftPth0jrPIaXSNwNle",
      email: "rohitchavda18@gmailya.com",
      mobile: "7878777800",
      gender: "m",
      birthdate: "2001-12-20",
      age: 22,
      image: null,
      isPremium: false,
      channelsSubscribed: [
        {
          channelId: "406528b5-8896-4547-8673-ad433782d96b",
          isbell: false,
          subscribedOn: {
            $date: "2024-02-16T11:14:03.038Z",
          },
        },
      ],
      buddies: [],
      userId: "023228ae-5edd-433a-b678-6666608ece01",
      videoDisliked: ["9c30a3dc-def7-401f-ab23-d0f2a64a55b6"],
      videoLiked: ["9c30a3dc-def7-401f-ab23-d0f2a64a55b6"],
    },
    {
      _id: {
        $oid: "65c38306ae9499ef7db27867",
      },
      firstname: "rohit",
      lastname: "chavda",
      password: "$2b$10$eQ.aFyJJhESvGKtBqSeasOg8OaQQCqVsy7cbzxZx.2r4uvQrRMF92",
      email: "rohitchavda158@gmailya.com",
      mobile: 1234567890,
      gender: "m",
      birthdate: "2000-12-08",
      age: null,
      image: null,
      isPremium: false,
      channelsSubscribed: [],
      buddies: [],
      userId: "3d80189a-110c-4498-845e-46f8aa27c528",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c3843f20d749df48b137fd",
      },
      firstname: "Afri",
      lastname: "Javed",
      password: "$2b$10$Wff4LtnrV75W3YsByXNXKu.IooIyrD6XwdhtyXX9uCejTDN4uJXwu",
      email: "barotpratham26689@gmail.com",
      mobile: "7418529631",
      gender: "m",
      birthdate: "1999-09-08",
      age: null,
      image:
        "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707312157/vqfsjox7ootkejdpvzmk.jpg",
      isPremium: false,
      channelsSubscribed: [],
      buddies: [],
      userId: "2cae9a53-ae15-4130-8b0a-60775ce264b3",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c385d156907e4398cf45ea",
      },
      firstname: "rohit",
      lastname: "chavda",
      password: "$2b$10$Hhuzt8xv5sXGcbFR9KnRRu2PWmUAcYjFcIc8IEWx1SsAS6lclYevC",
      email: "rohitchavda1580@gmailya.com",
      mobile: 1234567890,
      gender: "m",
      birthdate: "2000-12-08",
      age: 23,
      image: null,
      isPremium: false,
      channelsSubscribed: [],
      buddies: [],
      userId: "7cad0ac7-f1b2-4bc7-85c5-8091084d23a9",
      videoDisliked: [],
      videoLiked: [],
    },
    {
      _id: {
        $oid: "65c467989ad89d9f585561ef",
      },
      firstname: "Rao ",
      lastname: "Ecoe",
      password: "$2b$10$dGnCZnfUJ5K/Y1Lyo7BIvumOy0hAor0LUNmdm8iG0FAaJnnAyCiQi",
      email: "raoecommerce266@gmail.com",
      mobile: "7418529633",
      gender: "f",
      birthdate: "2004-09-08",
      age: 19,
      image:
        "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707370389/p0b48nbawbja4dtnnfp2.png",
      isPremium: false,
      channelsSubscribed: [],
      buddies: ["0984eeaa-7c28-423c-8a35-231a3ff3b0f5"],
      userId: "809fd2aa-bc99-4e66-a14f-a4daa4d69dfc",
      videoDisliked: [],
      videoLiked: [],
    },
  ];

  let result = [
    {
      totalCount: 5,
      channels: [
        {
          _id: "65b9eb0931a51cb0be4593ae",
          channelName: "DigitalInsights",
          description:
            "Dive into the digital world and gain valuable insights.",
          subscribersCount: 42000,
          avatarImage:
            "https://img.freepik.com/premium-vector/businessman-character-avatar-isolated_24877-57833.jpg?w=2000",
          isPremium: false,
          channelId: "ef221f28-8faa-4b19-b02e-7f404544ac59",
        },
        {
          _id: "65b9eb0931a51cb0be4593ad",
          channelName: "TechExplorer",
          description: "Unraveling the mysteries of cutting-edge technology.",
          subscribersCount: 55000,
          avatarImage:
            "https://img.freepik.com/premium-vector/gamer-youtuber-gaming-avatar-with-headphones-esport-logo_8169-260.jpg?w=2000",
          isPremium: true,
          channelId: "0f16046a-9ab4-41f7-a9da-58f662eda481",
        },
        {
          _id: "65b9eb0931a51cb0be4593b0",
          channelName: "InfiniteTechHub",
          description: "Exploring the limitless possibilities of technology.",
          subscribersCount: 89000,
          avatarImage:
            "https://img.freepik.com/premium-vector/technology-logo-collection_23-2148153848.jpg?w=2000",
          isPremium: true,
          channelId: "406528b5-8896-4547-8673-ad433782d96b",
        },
        {
          _id: "65b9eb0931a51cb0be4593c0",
          channelName: "ArtisticAdventures",
          description: "Embark on artistic journeys and creative explorations.",
          subscribersCount: 58000,
          avatarImage:
            "https://img.freepik.com/premium-vector/creative-woman-character-avatar_24877-57857.jpg?w=2000",
          isPremium: true,
          channelId: "c35e1adb-aa6f-43e9-90f7-4ca1757891e0",
        },
        {
          _id: "65b9eb0931a51cb0be4593af",
          channelName: "ScienceUnleashed",
          description: "Unlocking the wonders of science for curious minds.",
          subscribersCount: 72000,
          avatarImage:
            "https://img.freepik.com/premium-vector/scientist-character-avatar_24877-57784.jpg?w=2000",
          isPremium: true,
          channelId: "1ae3af65-5df6-4654-89e1-4299f7583b71",
        },
      ],
    },
  ];
  let mutualBuddies = {
    buddy: [
      {
        _id: "65c349d949e8a87abeb8e3f3",
        firstname: "PrathamSP",
        lastname: "Idar",
        password:
          "$2b$10$U4QjjZmph7yQ7L3lBgNRFeKDBslKdA28piH5rI5KeE3ngIBC4jmAi",
        email: "barotpratham862003@gmail.com",
        mobile: "7894561237",
        gender: "m",
        birthdate: "1978-09-09",
        age: 45,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707297235/u3jh1qzwulk9rrxkfk9c.png",
        isPremium: false,
        channelsSubscribed: [
          {
            channelId: "0f16046a-9ab4-41f7-a9da-58f662eda481",
            isbell: false,
            subscribedOn: "2024-02-16T11:10:42.444Z",
          },
        ],
        buddies: ["0984eeaa-7c28-423c-8a35-231a3ff3b0f5"],
        userId: "efe79206-ff32-4e61-9241-a55d79d94c15",
        videoDisliked: [],
        videoLiked: [],
      },
      {
        _id: "65c467989ad89d9f585561ef",
        firstname: "Rao ",
        lastname: "Ecoe",
        password:
          "$2b$10$dGnCZnfUJ5K/Y1Lyo7BIvumOy0hAor0LUNmdm8iG0FAaJnnAyCiQi",
        email: "raoecommerce266@gmail.com",
        mobile: "7418529633",
        gender: "f",
        birthdate: "2004-09-08",
        age: 19,
        image:
          "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707370389/p0b48nbawbja4dtnnfp2.png",
        isPremium: false,
        channelsSubscribed: [
          {
            channelId: "406528b5-8896-4547-8673-ad433782d96b",
            isbell: false,
            subscribedOn: "2024-02-23T06:36:38.080Z",
          },
          {
            channelId: "0f16046a-9ab4-41f7-a9da-58f662eda481",
            isbell: true,
            subscribedOn: "2024-02-23T06:36:41.176Z",
          },
        ],
        buddies: ["0984eeaa-7c28-423c-8a35-231a3ff3b0f5"],
        userId: "809fd2aa-bc99-4e66-a14f-a4daa4d69dfc",
        videoDisliked: [],
        videoLiked: [],
      },
    ],
  };

  const _getDataFromAggregation = userCollectionQueries.getDataFromAggregation;
  const _getUserFromDbUsingId = userCollectionQueries.getUserFromDbUsingId;
  const _bulkWriteInDb = userCollectionQueries.bulkWriteInDb;
  const _sendEmail = addBuddyMail.sendEmail;
  const _getUsersFromDb = userCollectionQueries.getUsersFromDb;

  beforeEach(() => {
    userCollectionQueries.getUserFromDbUsingId = jest.fn((userId) => {
      if (userId === "8db871d4-9413-4437-a49b-5847c46275df") return user;
      else if (userId === "0984eeaa-7c28-423c-8a35-231a3ff3b0f5")
        return userAnother;
      else if (userId === "2f74a2f7-93bd-4318-b1b4-dcea2cb0efb1")
        return thirdUser;
      else null;
    });

    addBuddyMail.sendEmail = jest.fn(() => {
      return { response: "Email sent from mocked" };
    });

    userCollectionQueries.bulkWriteInDb = jest.fn((operations) => {
      console.log("in mock bulkwrite");
    });

    userCollectionQueries.getUsersFromDb = jest.fn((condition) => {
      console.log("condition ", condition);
      //extracting the regex key passed in condition for mathing the condition

      if (condition.userId) {
        return buddyData.filter((buddy) => {
          return condition.userId["$in"].includes(buddy.userId);
        });
      } else if (Object.keys(condition).length > 0) {
        const name = condition.$or.map(
          (criteria) => criteria[Object.keys(criteria)[0]]
        );

        return buddyData.filter((buddy) => {
          const firstNameMatch = buddy.firstname.match(name[0]);
          const lastNameMatch = buddy.lastname.match(name[0]);

          return firstNameMatch || lastNameMatch;
        });
      } else {
        return buddyData;
      }
    });
    userCollectionQueries.getDataFromAggregation = jest.fn(
      (pipeline, string) => {
        if (string === "mutualbuddy") {
          return mutualBuddies;
        } else return result;
      }
    );
  });

  afterEach(() => {
    userCollectionQueries.getDataFromAggregation = _getDataFromAggregation;
    userCollectionQueries.getUserFromDbUsingId = _getUserFromDbUsingId;
    addBuddyMail.sendEmail = _sendEmail;
    userCollectionQueries.getUsersFromDb = _getUsersFromDb;
    userCollectionQueries.bulkWriteInDb = _bulkWriteInDb;
  });

  it("Requesting buddy failed : for valid buddy request", async () => {
    const response = await request
      .post("/api/buddy/request")
      .set("Cookie", `token=${jwt}`)
      .send({
        buddyId: "12345678945689",
      });

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("Unauthorised Buddy Request");
  });
  it("Requesting buddy succesfull : for valid buddy request", async () => {
    const response = await request
      .post("/api/buddy/request")
      .set("Cookie", `token=${jwt}`)
      .send({
        buddyId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email sent Succesfully");
  });

  //-----------------------------------------------------------------
  it("Searching buddy succesfull : when no searchTerm is there", async () => {
    const response = await request
      .get("/api/buddy/search")
      .set("Cookie", `token=${jwt}`)
      .query();

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("Searching buddy succesfull : when searchTerm is there", async () => {
    const response = await request
      .get("/api/buddy/search")
      .set("Cookie", `token=${jwt}`)
      .query({
        _searchTerm: "rohit",
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  //-----------------------------------------------------------------
  it("Add buddy Failed : buddy request rejected", async () => {
    const response = await request.post("/api/buddy/add").send({
      token: urlTokenwrong,
      decision: "reject",
    });

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("Request adding buddy rejected");
  });
  it("Add buddy Failed : buddy is not valid", async () => {
    const response = await request.post("/api/buddy/add").send({
      token: urlTokenwrong,
    });

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("Buddy not exists");
  });
  it("Add buddy Failed : buddy already added", async () => {
    const response = await request.post("/api/buddy/add").send({
      token: urlTokenCorrect,
    });

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("Buddy Already added");
  });
  it("Add buddy Succesfull :  Valid buddy ", async () => {
    const response = await request.post("/api/buddy/add").send({
      token: urlTokenAddBuddy,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buddy added succesfully");
  });
  it("show buddy  :  when there is no buddy ", async () => {
    const response = await request
      .get("/api/buddy/showbuddy")
      .set("Cookie", `token=${anotherJwt}`);

    expect(response.body.status).toBe(204);
    expect(response.body).toMatchSnapshot();
  });
  it("show buddy  :  Valid buddy data ", async () => {
    const response = await request
      .get("/api/buddy/showbuddy")
      .set("Cookie", `token=${jwt}`);

    expect(response.body.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("All channels shown :  When no buddy Ids provided ", async () => {
    const response = await request
      .post("/api/buddy/allchannels")
      .set("Cookie", `token=${jwt}`);

    expect(response.body.status).toBe(200);
    expect(response.body.channels).toMatchSnapshot();
    expect(response.body.totalCount).toBe(5);
    expect(response.body.totalPages).toBe(1);
  });
  it("All channels shown :  When buddy Ids provided ", async () => {
    const response = await request
      .post("/api/buddy/allchannels")
      .set("Cookie", `token=${jwt}`)
      .send({
        buddyId: [
          "8db871d4-9413-4437-a49b-5847c46275df",
          "2f74a2f7-93bd-4318-b1b4-dcea2cb0efb1",
        ],
      });

    expect(response.body.status).toBe(200);
    expect(response.body.channels).toMatchSnapshot();
  });
  it("show mutual buddy : with both bell true and false", async () => {
    const response = await request
      .post("/api/buddy/mutualbuddy/0f16046a-9ab4-41f7-a9da-58f662eda481")
      .set("Cookie", `token=${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("show mutual buddy : with bell", async () => {
    const response = await request
      .post("/api/buddy/mutualbuddy/0f16046a-9ab4-41f7-a9da-58f662eda481")
      .set("Cookie", `token=${jwt}`)
      .query({ isbell: "true" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
});
