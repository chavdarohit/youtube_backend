const request = require("./request");
const makeJwtToken = require("../utils/MakeAuthToken");
const jwt = makeJwtToken("8db871d4-9413-4437-a49b-5847c46275df");
const videoCollectionQueries = require("../queries/videoCollection");
const userCollectionQueries = require("../queries/userCollectionQueries");

describe("Analytics endpoint ", () => {
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
  const _getUserFromDbUsingId = userCollectionQueries.getUserFromDbUsingId;
  const _getDataFromAggregation = userCollectionQueries.getDataFromAggregation;

  const _getAllVideosFromAggreation =
    videoCollectionQueries.getAllVideosFromAggreation;
  beforeEach(() => {
    userCollectionQueries.getUserFromDbUsingId = jest.fn((userId) => {
      if (userId === "8db871d4-9413-4437-a49b-5847c46275df") return user;
      else if (userId === "0984eeaa-7c28-423c-8a35-231a3ff3b0f5")
        return userAnother;
      else if (userId === "2f74a2f7-93bd-4318-b1b4-dcea2cb0efb1")
        return thirdUser;
      else null;
    });
    userCollectionQueries.getDataFromAggregation = jest.fn(() => {
      return {
        subscriberAnalytics: [
          {
            _id: null,
            totalSubscribers: 6,
            totalmale: 5,
            totalfemale: 1,
            "0to20": 1,
            "20to40": 3,
            "40to60": 0,
          },
        ],
        newSubscribers: [
          {
            firstname: "Rao ",
            lastname: "Ecoe",
            gender: "f",
            age: 19,
            channel: {
              channelId: "406528b5-8896-4547-8673-ad433782d96b",
              isbell: false,
              subscribedOn: "2024-02-23T06:36:38.080Z",
            },
          },
          {
            firstname: "true",
            lastname: "rohit",
            gender: "m",
            age: 22,
            channel: {
              channelId: "406528b5-8896-4547-8673-ad433782d96b",
              isbell: false,
              subscribedOn: "2024-02-16T11:14:03.038Z",
            },
          },
          {
            firstname: "rohit",
            lastname: "chavda",
            gender: "m",
            age: null,
            channel: {
              channelId: "406528b5-8896-4547-8673-ad433782d96b",
              isbell: false,
              subscribedOn: "2024-02-16T11:12:10.264Z",
            },
          },
          {
            firstname: "rohit",
            lastname: "chavda",
            gender: "m",
            age: null,
            channel: {
              channelId: "406528b5-8896-4547-8673-ad433782d96b",
              isbell: false,
              subscribedOn: "2024-02-16T11:11:22.137Z",
            },
          },
          {
            firstname: "manojdey",
            lastname: "chavda",
            gender: "m",
            age: 23,
            channel: {
              channelId: "406528b5-8896-4547-8673-ad433782d96b",
              isbell: false,
              subscribedOn: "2024-02-16T11:09:17.447Z",
            },
          },
        ],
      };
    });

    videoCollectionQueries.getAllVideosFromAggreation = jest.fn(() => {
      return {
        videoAnalytics: [
          {
            _id: null,
            totalLikes: 6,
            totalDislikes: 3,
            totalComments: 1,
          },
        ],
        top5videos: [
          {
            _id: "65ccb5e552906fc9c0ba9ab2",
            videoTitle: "Home Gardening 101",
            videoLink: "https://www.youtube.com/watch?v=homegardening1313",
            description:
              "Start your own home garden with this beginner's guide.",
            totalLikes: 5,
            totalComments: 0,
            comments: [],
            tags: ["#gardening", "#homegarden", "#plants"],
            videoId: "c34fafad-97ce-465b-9596-403dae4bfb5f",
            uploadedBy: "406528b5-8896-4547-8673-ad433782d96b",
            totalDislikes: 2,
          },
          {
            _id: "65ccb5e552906fc9c0ba9ab1",
            videoTitle: "Pet Care Tips",
            videoLink: "https://www.youtube.com/watch?v=petcaretips1212",
            description:
              "Learn how to take care of your beloved pets with these tips.",
            totalLikes: 1,
            totalComments: 0,
            comments: ["its just wow"],
            tags: ["#petcare", "#animals", "#tips"],
            videoId: "9c30a3dc-def7-401f-ab23-d0f2a64a55b6",
            uploadedBy: "406528b5-8896-4547-8673-ad433782d96b",
            totalDislikes: 1,
          },
          {
            _id: "65ccb5e552906fc9c0ba9ab3",
            videoTitle: "Science Experiments for Kids",
            videoLink: "https://www.youtube.com/watch?v=scienceexperiments1414",
            description:
              "Make learning fun with these exciting science experiments.",
            totalLikes: 0,
            totalComments: 0,
            comments: [],
            tags: ["#science", "#experiments", "#kids"],
            videoId: "f3d906a8-7e5a-4e94-9f43-d864e5111d6c",
            uploadedBy: "406528b5-8896-4547-8673-ad433782d96b",
            totalDislikes: 0,
          },
        ],
      };
    });
  });
  afterEach(() => {
    userCollectionQueries.getUserFromDbUsingId = _getUserFromDbUsingId;
    userCollectionQueries.getDataFromAggregation = _getDataFromAggregation;
    videoCollectionQueries.getAllVideosFromAggreation =
      _getAllVideosFromAggreation;
  });

  it("video analytics", async () => {
    const response = await request
      .get("/api/analytics/video/406528b5-8896-4547-8673-ad433782d96b")
      .set("Cookie", `token=${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("subscribe analytics", async () => {
    const response = await request
      .get("/api/analytics/subscriber/406528b5-8896-4547-8673-ad433782d96b")
      .set("Cookie", `token=${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
});
