const validateEmailid = require("../validators/emailvalidation");

describe("validator", () => {
  let ctx;
  let next;

  beforeEach(() => {
    ctx = { request: { body: {} }, status: null, body: null };
    next = jest.fn();
  });

  it("it should validate email id", async () => {
    ctx.request.body.email = "rohitchavda@gmail.com;";

    await validateEmailid(ctx, next);
    expect(next).toHaveBeenCalled();
    expect(ctx.status).toBeNull();
    expect(ctx.body).toBeNull();
  });
});
