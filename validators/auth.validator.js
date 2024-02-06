const firstNameValidator = ({ firstname }) => {
  let err = null;

  if (!firstname) {
    err = { message: "Enter first name", field: "firstname" };
    return err;
  }
  firstname = firstname.trim();
  if (firstname.length < 3) {
    err = { message: "Minimum 3 characters required", field: "firstname" };
    return err;
  }
  if (firstname.length > 20) {
    err = { message: "Maximum 20 characters allowed", field: "firstname" };
    return err;
  }

  return err;
};
module.exports = firstNameValidator;
