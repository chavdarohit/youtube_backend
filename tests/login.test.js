const supertest = require("supertest");
const app = require("../app");
const userCollection = require("../queries/userCollection");
const request = supertest(app.listen());

describe("login endpoint", () => {
  const _getuserFromDbUsingEmail = userCollection.getUserFromDbUsingEmail;

  let validUser = {
    email: "test@example.com",
    // password: "securePassword",
    password: "$2a$10$9YbP8YRtKcwqt73cBcGW8OIcH1N7jKJdTSr8fbL4/K/S6soiqPehK",
  };

  beforeEach(() => {
    console.log("inside before each");
    userCollection.getUserFromDbUsingEmail = jest.fn((requestEmail) => {
      console.log("calling mock function");
      if (requestEmail === validUser.email) {
        return validUser;
      } else {
        return null;
      }
    });
  });

  // afterEach(() => {
  //   userCollection.getUserFromDbUsingEmail = _getuserFromDbUsingEmail;
  // });

  describe("login potentials", () => {
    it.only("Login should be succesfull with proper data", async () => {
      userCollection.getUserFromDbUsingEmail = jest.spyOn(
        userCollection,
        "getUserFromDbUsingEmail"
      );

      userCollection.getUserFromDbUsingEmail.mockImplementation(
        (requestEmail) => "mock"
      );
      const response = await request.post("/api/auth/login").send({
        email: "test@example.com",
        password: "securePassword",
      });
      expect(response.body.user).toEqual(validUser);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login succesfull");
      expect(response.body.token).toBeDefined();
    });

    it("Login failed with no proper email", async () => {
      const response = await request.post("/api/auth/login").send({
        email: "flamingo@mono.com",
        password: "securePassword",
      });
      expect(response.status).toBe(401);
      expect(response.text).toBe("Invalid credentials");
      expect(response.body.user).toEqual(null);
    });
    it("Login failed with no proper Password", async () => {
      const response = await request.post("/api/auth/login").send({
        email: "test@example.com",
        password: "falmi1234",
      });
      expect(response.status).toBe(401);
      expect(response.text).toBe("Invalid credentials");
    });
  });
});
