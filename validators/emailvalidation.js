
const validateEmailid = async (ctx, next) => {
  const { email } = ctx.request.body;

  try {
    if (!validateEmail(email)) {
      console.log("Invalid user email while login");
      throw new Error("Invalid email format");
    }
    console.log("Email verified in middleware");
    await next();
  } catch (err) {
    console.log("error inerr email validation : ", err);
    ctx.status = 400;
    ctx.body = err.message || "email validation error";
  }
};

function validateEmail(email) {
  let pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,4}$/;
  return pattern.test(email);
}

module.exports = {validateEmailid,validateEmail};
