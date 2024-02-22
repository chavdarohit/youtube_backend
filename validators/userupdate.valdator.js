const userUpdateValidator = (
  { firstname, lastname, mobile, gender, bday, age },
  ctx
) => {
  let err = null;
  const user = ctx.state.user;
  if (
    firstname === user.firstname &&
    lastname === user.lastname &&
    mobile === user.mobile &&
    gender === user.gender &&
    bday === user.bday &&
    age === user.age
  ) {
    console.log("No information updated - all Field are same");
    err = { status: 200, message: "No Information Updated" };
    return err;
  }
  return err;
};

module.exports = userUpdateValidator;
