const validate = (validators) => {
  return async (ctx, next) => {
    try {
      const validationErrors = [];

      for (let validator of validators) {
        const err = await validator(ctx.request.body,ctx);

        if (err) {
          validationErrors.push(err);
        }
      }

      if (validationErrors.length) {
        console.log("validation errors ", validationErrors);
        return (ctx.body = { status: 204, msg: validationErrors });
      }
      await next();
    } catch (err) {
      console.log(err);
    }
  };
};
module.exports = validate;
