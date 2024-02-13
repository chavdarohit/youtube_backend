const supertest = require("supertest");
const app = require("../app");

const request = supertest.agent(app.listen);
let ctx;
beforeEach(() => {
  ctx = {
    request: {
      body: { email: "rohitchavda@gmail.com", password: "sp@123456" },
    },
    status: null,
    body: null,
  };
});

describe("login AUthentication API", () => {
  it("should respond with 401 Unauthorized and 'Invalid credentials' for invalid email", async () => {
    const res = await request.post("/api/auth/login").send(ctx);
    expect(res.status).toBe(401);
    expect(res.body).toBe("Invalid credentials");
  });
});
