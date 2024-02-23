const request = require("./request");
const makeJwtToken = require("../utils/MakeAuthToken");
const videoCollectionQueries = require("../queries/videoCollection");
const userCollectionQueries = require("../queries/userCollectionQueries");
const videoInteractionQueries = require("../queries/videoInteractionQueries");

describe(" video Endpoint testings", () => {
  const jwt = makeJwtToken("8db871d4-9413-4437-a49b-5847c46275df");

  let videoInteraction = [
    {
      _id: {
        $oid: "65d45692ce40449882c40829",
      },
      userId: "023228ae-5edd-433a-b678-6666608ece01",
      videoId: "c34fafad-97ce-465b-9596-403dae4bfb5f",
      on: {
        $date: "2024-02-20T07:36:50.298Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d4570779075c4f70039adf",
      },
      userId: "023228ae-5edd-433a-b678-6666608ece01",
      videoId: "c34fafad-97ce-465b-9596-403dae4bfb5f",
      on: {
        $date: "2024-02-20T07:38:47.550Z",
      },
      status: "disliked",
    },
    {
      _id: {
        $oid: "65d461848cc237a60171c5fb",
      },
      userId: "023228ae-5edd-433a-b678-6666608ece01",
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aaff",
      on: {
        $date: "2024-02-20T08:23:32.582Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d461bc0ae8608b24ab334e",
      },
      userId: "023228ae-5edd-433a-b678-6666608ece01",
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aaff",
      on: {
        $date: "2024-02-20T08:24:28.623Z",
      },
      status: "disliked",
    },
    {
      _id: {
        $oid: "65d851a3bed3e457bb53cc9b",
      },
      userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aaff",
      on: {
        $date: "2024-02-23T08:04:51.381Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d851a7bed3e457bb53cc9c",
      },
      userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aaf",
      on: {
        $date: "2024-02-23T08:04:55.482Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d851abbed3e457bb53cc9d",
      },
      userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aa",
      on: {
        $date: "2024-02-23T08:04:59.052Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d851b2bed3e457bb53cc9e",
      },
      userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      videoId: "123",
      on: {
        $date: "2024-02-23T08:05:06.209Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d8523b5146997cbe33eee8",
      },
      userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      videoId: "1234",
      on: {
        $date: "2024-02-23T08:07:23.227Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d85acd63f230c1e7f353c5",
      },
      userId: "0984eeaa-7c28-423c-8a35-231a3ff3b0f5",
      videoId: "12345",
      on: {
        $date: "2024-02-23T08:43:57.480Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d85fc3b91cd8f64057b663",
      },
      userId: "8db871d4-9413-4437-a49b-5847c46275df",
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aaff",
      on: {
        $date: "2024-02-23T09:05:07.249Z",
      },
      status: "liked",
    },
    {
      _id: {
        $oid: "65d85fdfb91cd8f64057b664",
      },
      userId: "8db871d4-9413-4437-a49b-5847c46275df",
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aaff",
      on: {
        $date: "2024-02-23T09:05:35.243Z",
      },
      status: "disliked",
    },
  ];

  let videos = [
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aa3",
      },
      videoTitle: "Introduction to Programming",
      videoLink: "https://www.youtube.com/watch?v=programmingintro123",
      description: "A beginner's guide to programming.",
      totalLikes: 3,
      totalComments: 0,
      comments: ["amazing", "awesome video"],
      tags: ["#programming", "#coding", "#beginner"],
      videoId: "a9725606-f001-4f37-82dc-cfaeaa10aaff",
      uploadedBy: "0f16046a-9ab4-41f7-a9da-58f662eda481",
      totalDislikes: 2,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aa4",
      },
      videoTitle: "Travel Vlog: Exploring Nature",
      videoLink: "https://www.youtube.com/watch?v=natureexploration456",
      description: "Join us on a journey to explore the beauty of nature.",
      totalLikes: 1,
      totalComments: 0,
      comments: [],
      tags: ["#travel", "#nature", "#vlog"],
      videoId: "c72f32ff-f50a-433c-9238-833bf4bec159",
      uploadedBy: "0f16046a-9ab4-41f7-a9da-58f662eda481",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aa5",
      },
      videoTitle: "Fitness Workout for Beginners",
      videoLink: "https://www.youtube.com/watch?v=fitnessworkout789",
      description: "Get fit with this easy workout routine for beginners.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#fitness", "#workout", "#exercise"],
      videoId: "93d6a59c-e5b6-436d-99d3-98d868670514",
      uploadedBy: "0f16046a-9ab4-41f7-a9da-58f662eda481",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aa6",
      },
      videoTitle: "DIY Home Decor Ideas",
      videoLink: "https://www.youtube.com/watch?v=diyhomedecor101",
      description: "Upgrade your home with these creative DIY decor ideas.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#DIY", "#homedecor", "#crafts"],
      videoId: "eff3a1af-965a-4646-a6fd-d48fd2936e26",
      uploadedBy: "0f16046a-9ab4-41f7-a9da-58f662eda481",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aa7",
      },
      videoTitle: "Healthy Cooking Recipes",
      videoLink: "https://www.youtube.com/watch?v=healthycooking202",
      description: "Learn to cook delicious and healthy recipes at home.",
      totalLikes: 0,
      totalComments: 0,
      comments: ["crazy"],
      tags: ["#cooking", "#recipes", "#healthy"],
      videoId: "242a011b-f521-4eff-aac7-ba1ca77b038d",
      uploadedBy: "0f16046a-9ab4-41f7-a9da-58f662eda481",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aa8",
      },
      videoTitle: "Photography Tips and Tricks",
      videoLink: "https://www.youtube.com/watch?v=photographytips303",
      description:
        "Improve your photography skills with these tips and tricks.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#photography", "#tips", "#tricks"],
      videoId: "0d39bfaf-19d5-4f7e-a2c8-530d830a6bfc",
      uploadedBy: "0f16046a-9ab4-41f7-a9da-58f662eda481",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aa9",
      },
      videoTitle: "Music Production Tutorial",
      videoLink: "https://www.youtube.com/watch?v=musicproduction404",
      description: "Create your own music with this step-by-step tutorial.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#musicproduction", "#tutorial", "#music"],
      videoId: "6c46611f-b9ce-4577-9880-514a81dbf735",
      uploadedBy: "ef221f28-8faa-4b19-b02e-7f404544ac59",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aaa",
      },
      videoTitle: "Learning a New Language",
      videoLink: "https://www.youtube.com/watch?v=newlanguagetraining505",
      description:
        "Start your journey to learn a new language with effective training.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#languagelearning", "#education", "#tutorial"],
      videoId: "b6782e9a-369f-4121-9498-72f858d44129",
      uploadedBy: "ef221f28-8faa-4b19-b02e-7f404544ac59",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aab",
      },
      videoTitle: "Art and Craft Ideas",
      videoLink: "https://www.youtube.com/watch?v=artandcraft606",
      description:
        "Discover creative art and craft ideas for your next project.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#art", "#crafts", "#creativity"],
      videoId: "421d1049-8eb7-4a76-b7ae-eebd4cebc8c3",
      uploadedBy: "ef221f28-8faa-4b19-b02e-7f404544ac59",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aac",
      },
      videoTitle: "Virtual Reality Gaming Experience",
      videoLink: "https://www.youtube.com/watch?v=vrgaming707",
      description: "Immerse yourself in a virtual reality gaming adventure.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#gaming", "#virtualreality", "#experience"],
      videoId: "cf9154d4-8e15-4cc5-adc8-ae9306188f23",
      uploadedBy: "ef221f28-8faa-4b19-b02e-7f404544ac59",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aad",
      },
      videoTitle: "Mindfulness Meditation Session",
      videoLink: "https://www.youtube.com/watch?v=mindfulness808",
      description:
        "Relax and unwind with a guided mindfulness meditation session.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#mindfulness", "#meditation", "#relaxation"],
      videoId: "0dbe7db6-d219-42a6-8295-692a6cab2feb",
      uploadedBy: "1ae3af65-5df6-4654-89e1-4299f7583b71",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aae",
      },
      videoTitle: "Fashion Trends 2022",
      videoLink: "https://www.youtube.com/watch?v=fashiontrends909",
      description: "Explore the latest fashion trends for the year 2022.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#fashion", "#trends", "#style"],
      videoId: "2787a1d1-b856-44f4-a93a-7d6b4307d9d9",
      uploadedBy: "1ae3af65-5df6-4654-89e1-4299f7583b71",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9aaf",
      },
      videoTitle: "Historical Documentaries",
      videoLink: "https://www.youtube.com/watch?v=historicaldocs1010",
      description:
        "Dive into the past with intriguing historical documentaries.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#history", "#documentary", "#education"],
      videoId: "5fdf2e3c-ea19-4449-8fe3-ddb4a293f133",
      uploadedBy: "1ae3af65-5df6-4654-89e1-4299f7583b71",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9ab0",
      },
      videoTitle: "Tech Gadgets Unboxing",
      videoLink: "https://www.youtube.com/watch?v=gadgetsunboxing1111",
      description: "Unbox the latest and coolest tech gadgets on the market.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#technology", "#gadgets", "#unboxing"],
      videoId: "b97598e5-ceb0-4998-bfa8-592269e241ce",
      uploadedBy: "1ae3af65-5df6-4654-89e1-4299f7583b71",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9ab1",
      },
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
      _id: {
        $oid: "65ccb5e552906fc9c0ba9ab2",
      },
      videoTitle: "Home Gardening 101",
      videoLink: "https://www.youtube.com/watch?v=homegardening1313",
      description: "Start your own home garden with this beginner's guide.",
      totalLikes: 5,
      totalComments: 0,
      comments: [],
      tags: ["#gardening", "#homegarden", "#plants"],
      videoId: "c34fafad-97ce-465b-9596-403dae4bfb5f",
      uploadedBy: "406528b5-8896-4547-8673-ad433782d96b",
      totalDislikes: 2,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9ab3",
      },
      videoTitle: "Science Experiments for Kids",
      videoLink: "https://www.youtube.com/watch?v=scienceexperiments1414",
      description: "Make learning fun with these exciting science experiments.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#science", "#experiments", "#kids"],
      videoId: "f3d906a8-7e5a-4e94-9f43-d864e5111d6c",
      uploadedBy: "406528b5-8896-4547-8673-ad433782d96b",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9ab4",
      },
      videoTitle: "Culinary Adventures Around the World",
      videoLink: "https://www.youtube.com/watch?v=culinaryadventures1515",
      description:
        "Embark on a culinary journey exploring flavors from around the world.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#culinary", "#foodie", "#travel"],
      videoId: "50128a3e-f8a2-4000-9440-0a1960f6ae2e",
      uploadedBy: "1c7ac704-16c6-47f0-b4e3-b59ce916f524",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9ab5",
      },
      videoTitle: "Digital Art Showcase",
      videoLink: "https://www.youtube.com/watch?v=digitalart1616",
      description:
        "Experience the creativity of digital artists in this showcase.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#digitalart", "#artshowcase", "#creativity"],
      videoId: "514dc559-00aa-4d6e-93ba-9591daeef9e3",
      uploadedBy: "1c7ac704-16c6-47f0-b4e3-b59ce916f524",
      totalDislikes: 0,
    },
    {
      _id: {
        $oid: "65ccb5e552906fc9c0ba9ab6",
      },
      videoTitle: "Motivational Talks for Success",
      videoLink: "https://www.youtube.com/watch?v=motivation1717",
      description: "Get inspired with motivational talks to achieve success.",
      totalLikes: 0,
      totalComments: 0,
      comments: [],
      tags: ["#motivation", "#success", "#inspiration"],
      videoId: "cad66644-6a7a-4b25-a663-52b28c5bbd97",
      uploadedBy: "1c7ac704-16c6-47f0-b4e3-b59ce916f524",
      totalDislikes: 0,
    },
  ];

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
    buddies: [],
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

  const _addRecord = videoInteractionQueries.addRecord;
  const _findVideo = videoInteractionQueries.findVideo;
  const _getUserFromDbUsingId = userCollectionQueries.getUserFromDbUsingId;
  const _getAllVideos = videoCollectionQueries.getAllVideos;
  const _updateVideo = videoCollectionQueries.updateVideo;

  beforeEach(() => {
    let filteredVideos;
    videoCollectionQueries.getAllVideos = jest.fn((condition) => {
      console.log("condition", condition);
      if (condition.videoId) {
        return videos.find((video) => {
          return video.videoId === condition.videoId;
        });
      }
      if (condition.uploadedBy) {
        filteredVideos = videos.filter((video) => {
          return video.uploadedBy === condition.uploadedBy;
        });
      }
      if (condition.videoTitle) {
        filteredVideos = filteredVideos.filter((video) => {
          return video.videoTitle.match(condition.videoTitle);
        });
      }
      if (condition.tags) {
        filteredVideos = filteredVideos.filter((video) => {
          return video.tags.some((tag) => condition.tags.test(tag));
        });
      }
      return filteredVideos;
    });
    userCollectionQueries.getUserFromDbUsingId = jest.fn((userId) => {
      if (userId === "8db871d4-9413-4437-a49b-5847c46275df") return user;
      else if (userId === "0984eeaa-7c28-423c-8a35-231a3ff3b0f5")
        return userAnother;
      else null;
    });
    videoInteractionQueries.findVideo = jest.fn((data) => {
      return videoInteraction.find((video) => {
        return (
          video.userId === data.userId &&
          video.videoId === data.videoId &&
          video.status === data.status
        );
      });
    });
  });

  videoCollectionQueries.updateVideo = jest.fn(() => {});

  videoInteractionQueries.addRecord = jest.fn(() => {});

  afterEach(() => {
    videoCollectionQueries.updateVideo = _updateVideo;

    videoCollectionQueries.getAllVideos = _getAllVideos;
    userCollectionQueries.getUserFromDbUsingId = _getUserFromDbUsingId;
    videoInteractionQueries.findVideo = _findVideo;
    videoInteractionQueries.addRecord = _addRecord;
  });
  it("video list : when no search conditions are provided", async () => {
    const response = await request
      .get("/api/video/list")
      .set("Cookie", `token=${jwt}`)
      .query({
        channelId: "ef221f28-8faa-4b19-b02e-7f404544ac59",
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("video list : when title is provided", async () => {
    const response = await request
      .get("/api/video/list")
      .set("Cookie", `token=${jwt}`)
      .query({
        channelId: "ef221f28-8faa-4b19-b02e-7f404544ac59",
        title: "music",
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("video list : when tag is provided", async () => {
    const response = await request
      .get("/api/video/list")
      .set("Cookie", `token=${jwt}`)
      .query({
        channelId: "ef221f28-8faa-4b19-b02e-7f404544ac59",
        tags: "gaming",
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("video like failed : no such video present ", async () => {
    const response = await request
      .get("/api/video/like/123")
      .set("Cookie", `token=${jwt}`);

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("No video Found");
  });
  it("video like failed : Already video liked ", async () => {
    const response = await request
      .get("/api/video/like/a9725606-f001-4f37-82dc-cfaeaa10aaff")
      .set("Cookie", `token=${jwt}`);

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("video Already Liked");
  });
  it("video like succesfull : valid like ", async () => {
    const response = await request
      .get("/api/video/like/cad66644-6a7a-4b25-a663-52b28c5bbd97")
      .set("Cookie", `token=${jwt}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Video Liked");
  });

  it("video dislike failed : Already video disliked ", async () => {
    const response = await request
      .get("/api/video/dislike/a9725606-f001-4f37-82dc-cfaeaa10aaff")
      .set("Cookie", `token=${jwt}`);

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("video Already Disliked");
  });

  it("video dislike succesfull : valid dislike ", async () => {
    const response = await request
      .get("/api/video/dislike/cad66644-6a7a-4b25-a663-52b28c5bbd97")
      .set("Cookie", `token=${jwt}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Video Disliked");
  });
  it("video Comment succesfully : valid dislike ", async () => {
    const response = await request
      .post("/api/video/comment/9c30a3dc-def7-401f-ab23-d0f2a64a55b6")
      .set("Cookie", `token=${jwt}`)
      .send({
        comment: "amazing",
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe("comment sucessfull");
  });
});
