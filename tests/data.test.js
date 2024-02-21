const makeJwtToken = require("../utils/MakeAuthToken");
const request = require("./request");
const userCollectionQueries = require("../queries/userCollectionQueries");
const suggestedCollectionsQueries = require("../queries/suggestedCollections");

describe("Data testings", () => {
  const jwt = makeJwtToken("8db871d4-9413-4437-a49b-5847c46275df");

  let user = {
    firstname: "manojdey",
    lastname: "chavda",
    password: "$2a$10$7A7DYxLdYGP.9IFZlmnOHOJsWLoH.XIeSx/RNGRlYfwB4tuMFPyyC",
    email: "test@example.com",
    mobile: 7878776207,
    gender: "m",
    bday: "2000-12-8",
    age: 23,
    image:
      "https://res.cloudinary.com/dlw3jhfua/image/upload/v1707296925/ifppmu0f…",
    isPremium: false,
    channelsSubscribed: [
      {
        channelId: "406528b5-8896-4547-8673-ad433782d96b",
        isbell: false,
        subscribedOn: new Date(),
      },
    ],
    buddies: [],
    userId: "8db871d4-9413-4437-a49b-5847c46275df",
  };

  const _getUserFromDbUsingId = userCollectionQueries.getUserFromDbUsingId;
  const _getAllChannels = suggestedCollectionsQueries.getAllChannels;
  beforeEach(() => {
    userCollectionQueries.getUserFromDbUsingId = jest.fn((userId) => {
      if (userId === "8db871d4-9413-4437-a49b-5847c46275df") return user;
      else null;
    });
    suggestedCollectionsQueries.getAllChannels = jest.fn();
    //pending
  });
  afterEach(() => {
    userCollectionQueries.getUserFromDbUsingId = _getUserFromDbUsingId;
    suggestedCollectionsQueries.getAllChannels = _getAllChannels;
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

  it("suggested channels", async () => {
    const response = await request
      .get("/api/data/suggested")
      .set("Cookie", `token=${jwt}`)
      .send();

    except(response.body.status).toBe(200);
    except(response.body).toMatchSnapshot();
  });
});
