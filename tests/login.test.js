const supertest = require("supertest");
const app = require("../app");

const request = supertest.agent(app.listen());

// describe("PublicRouter", () => {
//   it('should respond with "Hello World" for post /', async () => {
//     const response = await request.post("/");
//     expect(response.status).toBe(200);
//     expect(response.text).toBe("Hello World");
//   });
// });

describe("login endpoint", () => {
  let validUser;

  beforeEach(() => {
    validUser = {
      email: "test@example.com",
      password: "securePassword",
    };
  });

  jest.mock("../queries/userCollection", () => ({
    getUserFromDbUsingEmail: jest.fn().mockResolvedValue(validUser),
  }));

  jest.mock("bcrypt", () => ({
    compare: jest.fn().mockResolvedValue(true),
  }));
  
  it("should be login", async () => {
    const response = await request.post("/api/auth/login").send(validUser);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login succesfull");
    expect(response.body.token).toBeDefined();

    expect(response.body.user).toEqual(validUser);
  });

  it("Login failed with no proper email", async () => {
    jest.mock("../queries/userCollection", () => ({
      getUserFromDbUsingEmail: jest.fn().mockResolvedValue(null),
    }));

    const response = await request.post("/api/auth/login").send(validUser);
    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid credentials");
  });
});
