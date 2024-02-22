const makeJwtToken = require("../utils/MakeAuthToken");
const request = require("./request");
const userCollectionQueries = require("../queries/userCollectionQueries");
const suggestedCollectionsQueries = require("../queries/suggestedCollections");

describe("Data testings", () => {
  const jwt = makeJwtToken("8db871d4-9413-4437-a49b-5847c46275df");
  const anotherJwt = makeJwtToken("0984eeaa-7c28-423c-8a35-231a3ff3b0f5");

  let suggestedChannels = [
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593ad",
      },
      channelName: "TechExplorer",
      description: "Unraveling the mysteries of cutting-edge technology.",
      subscribersCount: 55000,
      avatarImage:
        "https://img.freepik.com/premium-vector/gamer-youtuber-gaming-avatar-with-headphones-esport-logo_8169-260.jpg?w=2000",
      isPremium: true,
      channelId: "0f16046a-9ab4-41f7-a9da-58f662eda481",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593ae",
      },
      channelName: "DigitalInsights",
      description: "Dive into the digital world and gain valuable insights.",
      subscribersCount: 42000,
      avatarImage:
        "https://img.freepik.com/premium-vector/businessman-character-avatar-isolated_24877-57833.jpg?w=2000",
      isPremium: false,
      channelId: "ef221f28-8faa-4b19-b02e-7f404544ac59",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593af",
      },
      channelName: "ScienceUnleashed",
      description: "Unlocking the wonders of science for curious minds.",
      subscribersCount: 72000,
      avatarImage:
        "https://img.freepik.com/premium-vector/scientist-character-avatar_24877-57784.jpg?w=2000",
      isPremium: true,
      channelId: "1ae3af65-5df6-4654-89e1-4299f7583b71",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b0",
      },
      channelName: "InfiniteTechHub",
      description: "Exploring the limitless possibilities of technology.",
      subscribersCount: 89000,
      avatarImage:
        "https://img.freepik.com/premium-vector/technology-logo-collection_23-2148153848.jpg?w=2000",
      isPremium: true,
      channelId: "406528b5-8896-4547-8673-ad433782d96b",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b1",
      },
      channelName: "NatureWonders",
      description:
        "Discovering the awe-inspiring wonders of the natural world.",
      subscribersCount: 62000,
      avatarImage:
        "https://img.freepik.com/premium-vector/nature-landscape-scene-silhouette_33099-435.jpg?w=2000",
      isPremium: false,
      channelId: "1c7ac704-16c6-47f0-b4e3-b59ce916f524",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b2",
      },
      channelName: "HealthMatters",
      description: "Your guide to a healthier and happier life.",
      subscribersCount: 78000,
      avatarImage:
        "https://img.freepik.com/premium-vector/doctor-character-avatar_24877-57947.jpg?w=2000",
      isPremium: true,
      channelId: "f5d265f4-9e1d-4576-83e3-add4a7362131",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b3",
      },
      channelName: "CodeCrafters",
      description: "Crafting elegant code for modern software development.",
      subscribersCount: 72000,
      avatarImage:
        "https://img.freepik.com/premium-vector/programmer-avatar_24877-57809.jpg?w=2000",
      isPremium: true,
      channelId: "05657435-fb8c-4ea4-b99d-21c8b7b895b5",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b4",
      },
      channelName: "ExploreTheCosmos",
      description:
        "Embark on a cosmic journey through the mysteries of the universe.",
      subscribersCount: 92000,
      avatarImage:
        "https://img.freepik.com/premium-vector/astronaut-character-avatar_24877-57837.jpg?w=2000",
      isPremium: false,
      channelId: "9605ee33-6b20-418e-81a4-7ba2177c96dc",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b5",
      },
      channelName: "TravelEnthusiast",
      description: "Roaming the world and sharing the wonders of travel.",
      subscribersCount: 48000,
      avatarImage:
        "https://img.freepik.com/premium-vector/traveler-character-avatar_24877-57849.jpg?w=2000",
      isPremium: true,
      channelId: "95e28f87-941e-4cbf-ac4b-6f326fd19a65",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b6",
      },
      channelName: "ArtisticExpressions",
      description: "Immerse yourself in the world of artistic creations.",
      subscribersCount: 54000,
      avatarImage:
        "https://img.freepik.com/premium-vector/artist-character-avatar_24877-57856.jpg?w=2000",
      isPremium: false,
      channelId: "31f6433c-972d-499a-ba35-cfd7b6d45004",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b7",
      },
      channelName: "FoodFiesta",
      description: "Savor the flavors with delightful culinary experiences.",
      subscribersCount: 68000,
      avatarImage:
        "https://img.freepik.com/premium-vector/chef-character-avatar_24877-57789.jpg?w=2000",
      isPremium: false,
      channelId: "d164f342-cf1a-4efa-9d4b-05182fe2d773",
    },
    {
      _id: {
        $oid: "65b9eb0931a51cb0be4593b8",
      },
      channelName: "MindfulMeditation",
      description: "Achieve tranquility through mindful meditation practices.",
      subscribersCount: 55000,
      avatarImage:
        "https://img.freepik.com/premium-vector/yoga-instructor-character-avatar_24877-57840.jpg?w=2000",
      isPremium: true,
      channelId: "f8cbf63c-41e2-46ac-a0a3-daa4e0202002",
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

  const _getUserFromDbUsingId = userCollectionQueries.getUserFromDbUsingId;
  const _getAllChannels = suggestedCollectionsQueries.getAllChannels;
  const _getChannelCountFromId =
    suggestedCollectionsQueries.getChannelCountFromId;
  const _updateUser = userCollectionQueries.updateUser;
  const _updateUserChannelBellIconStatus =
    userCollectionQueries.updateUserChannelBellIconStatus;
  const _updateUserToPremium = userCollectionQueries.updateUserToPremium;

  beforeEach(() => {
    userCollectionQueries.getUserFromDbUsingId = jest.fn((userId) => {
      if (userId === "8db871d4-9413-4437-a49b-5847c46275df") return user;
      else if (userId === "0984eeaa-7c28-423c-8a35-231a3ff3b0f5")
        return userAnother;
      else null;
    });
    suggestedCollectionsQueries.getAllChannels = jest.fn(
      (condition, skip, limit, sort) => {
        // console.log("condition ", condition);
        // console.log("sort ", sort);

        if (condition.channelName) {
          const channels = suggestedChannels.filter((channel) =>
            channel.channelName.match(condition.channelName)
          );
          return { channels, totalCount: channels.length };
        } else if (condition.channelId) {
          let channels = suggestedChannels.filter((channel) => {
            return condition.channelId["$in"].includes(channel.channelId);
          });

          if (sort.channelName === 1)
            channels = channels.sort((a, b) => {
              return a.channelName.localeCompare(b.channelName);
            });
          if (sort.channelName === -1)
            channels = channels.sort((a, b) => {
              return b.channelName.localeCompare(a.channelName);
            });

          if (sort.subscribersCount === 1)
            channels = channels.sort((a, b) => {
              return a.subscribersCount - b.subscribersCount;
            });
          if (sort.subscribersCount === -1)
            channels = channels.sort((a, b) => {
              return b.subscribersCount - a.subscribersCount;
            });

          return { channels, totalCount: channels.length };
        } else {
          return {
            channels: suggestedChannels,
            totalCount: suggestedChannels.length,
          };
        }
      }
    );

    suggestedCollectionsQueries.getChannelCountFromId = jest.fn((channelId) => {
      if (
        channelId === "0f16046a-9ab4-41f7-a9da-58f662eda481" ||
        channelId === "406528b5-8896-4547-8673-ad433782d96b" ||
        channelId === "ef221f28-8faa-4b19-b02e-7f404544ac59"
      )
        return 1;
      else return 0;
    });

    userCollectionQueries.updateUser = jest.fn();
    userCollectionQueries.updateUserChannelBellIconStatus = jest.fn(
      (userId, channelId, bell) => {
        return bell ? false : true;
      }
    );
    userCollectionQueries.updateUserToPremium = jest.fn((userId) => {
      if (userId === "8db871d4-9413-4437-a49b-5847c46275df") return user;
      else if (userId === "0984eeaa-7c28-423c-8a35-231a3ff3b0f5")
        return userAnother;
      else null;
    });
  });

  afterEach(() => {
    userCollectionQueries.getUserFromDbUsingId = _getUserFromDbUsingId;
    suggestedCollectionsQueries.getAllChannels = _getAllChannels;
    suggestedCollectionsQueries.getChannelCountFromId = _getChannelCountFromId;
    userCollectionQueries.updateUser = _updateUser;
    userCollectionQueries.updateUserChannelBellIconStatus =
      _updateUserChannelBellIconStatus;

    userCollectionQueries.updateUserToPremium = _updateUserToPremium;
  });

  it("view profile failed  : token missing", async () => {
    const response = await request.get("/api/data/profile").send();
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Unauthorized - Missing Token");
  });
  it("view profile failed : BAD authentication JWT", async () => {
    const response = await request
      .get("/api/data/profile")
      .set(
        "Cookie",
        `token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"`
      )
      .send();
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "Unauthorized user - Bad Request from middleware"
    );
  });
  it("view profile sucess : authenticated JWT", async () => {
    const response = await request
      .get("/api/data/profile")
      .set("Cookie", `token=${jwt}`)
      .send();
    expect(response.body.status).toBe(200);
    expect(response.body.user).toBeDefined();
  });

  it("all suggested channels", async () => {
    const response = await request
      .get("/api/data/suggested")
      .set("Cookie", `token=${jwt}`)
      .query({
        _searchTerm: "tech",
        // _limit: 5,
        // _page: 1,
      })
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("subscribe channel failed : No such channel exists ", async () => {
    const response = await request
      .get("/api/data/subscribe/123456")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.text).toBe("No channel Found");
  });
  it("subscribe channel failed : Channel Already Subscribed ", async () => {
    const response = await request
      .get("/api/data/subscribe/0f16046a-9ab4-41f7-a9da-58f662eda481")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe("Channel Already Subscribed");
  });
  it("subscribe channel Success : valid channel   ", async () => {
    const response = await request
      .get("/api/data/subscribe/406528b5-8896-4547-8673-ad433782d96b")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.text).toBe("Channel Subscribed");
  });
  //========================================================================
  it("Unsubscribe channel failed : No such channel exists ", async () => {
    const response = await request
      .get("/api/data/unsubscribe/123456")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.text).toBe("No channel Found");
  });
  it("Unsubscribe channel failed : not found in users acc ", async () => {
    const response = await request
      .get("/api/data/unsubscribe/406528b5-8896-4547-8673-ad433782d96b")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe(
      "Channel Not Found for Unsubscribe"
    );
  });
  it("Unsubscribed channel Success : valid channel   ", async () => {
    const response = await request
      .get("/api/data/unsubscribe/0f16046a-9ab4-41f7-a9da-58f662eda481")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.text).toBe("Channel Unsubscribed");
  });

  //========================================================================
  it("View Subscribed Channel : valid channel   ", async () => {
    const response = await request
      .get("/api/data/viewsubscribed")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("View Subscribed Channel : No channel Found   ", async () => {
    const response = await request
      .get("/api/data/viewsubscribed")
      .set("Cookie", `token=${anotherJwt}`)
      .send();

    expect(response.status).toBe(204);
    expect(response.body).toMatchSnapshot();
  });
  it("View Subscribed Channel : Name in Ascending   ", async () => {
    const response = await request
      .get("/api/data/viewsubscribed")
      .set("Cookie", `token=${jwt}`)
      .query({
        _name: "asc",
      })
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("View Subscribed Channel : Name in Descending ", async () => {
    const response = await request
      .get("/api/data/viewsubscribed")
      .set("Cookie", `token=${jwt}`)
      .query({
        _name: "desc",
      })
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("View Subscribed Channel : Subscribers in Ascending ", async () => {
    const response = await request
      .get("/api/data/viewsubscribed")
      .set("Cookie", `token=${jwt}`)
      .query({
        _subscribers: "asc",
      })
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });
  it("View Subscribed Channel : Subscribers in Descending ", async () => {
    const response = await request
      .get("/api/data/viewsubscribed")
      .set("Cookie", `token=${jwt}`)
      .query({
        _subscribers: "desc",
      })
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  //------------------------------------------------------------------
  it("Bell icon failed : No such channel exists ", async () => {
    const response = await request
      .get("/api/data/bell/123456")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.text).toBe("No channel Found");
  });
  it("Bell icon failed : not found in users acc ", async () => {
    const response = await request
      .get("/api/data/bell/406528b5-8896-4547-8673-ad433782d96b")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.body.status).toBe(204);
    expect(response.body.msg[0].message).toBe(
      "Channel Not Found for Bell Notification"
    );
  });
  it("BellIcon Success : valid channel notification enabled  ", async () => {
    const response = await request
      .get("/api/data/bell/0f16046a-9ab4-41f7-a9da-58f662eda481")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You will recieve Notifications");
  });
  it("BellIcon Success : valid channel notification disbled ", async () => {
    const response = await request
      .get("/api/data/bell/ef221f28-8faa-4b19-b02e-7f404544ac59")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Notification Disabled");
  });

  //---------------------------------------------------------------------------
  it("Premium sucess : user upgraded", async () => {
    const response = await request
      .get("/api/data/premium")
      .set("Cookie", `token=${jwt}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User downgrade to Normal");
    expect(response.body.user).toStrictEqual(user);
  });
  it("Premium sucess : user Downgraded", async () => {
    const response = await request
      .get("/api/data/premium")
      .set("Cookie", `token=${anotherJwt}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated to Premium");
    expect(response.body.user).toStrictEqual(userAnother);
  });

  //-------------------------------------------------------------------------

  it("User update failed : All information are same", async () => {
    const response = await request
      .post("/api/data/updateprofile")
      .set("Cookie", `token=${jwt}`)
      .send({
        firstname: "manojdey",
        lastname: "chavda",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
      });

    expect(response.body.msg[0].status).toBe(200);
    expect(response.body.msg[0].message).toBe("No Information Updated");
  });
  it("User update sucess : Information updated", async () => {
    const response = await request
      .post("/api/data/updateprofile")
      .set("Cookie", `token=${jwt}`)
      .send({
        firstname: "chandan",
        lastname: "chavda",
        mobile: "7878776207",
        gender: "m",
        bday: "2000-12-8",
        age: 23,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User Profile Updated Succesfully");
  });
});
