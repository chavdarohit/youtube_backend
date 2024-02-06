const validate = (validators) => {
  return async (ctx, next) => {
    try {
      const validationErrors = [];

      for (let validator of validators) {
        const err = validator(ctx.request.body);

        if (err) {
          validationErrors.push(err);
        }
      }

      if (validationErrors.length) {
        return (ctx.body = { status: 204, msg: validationErrors });
      }
      await next();
    } catch (err) {
      console.log(err);
    }
  };
};
module.exports = validate;
