const { getUserFromDbUsingEmail } = require("../queries/userCollectionQueries");

let namePattern = /^[a-zA-Z]+$/;
let passwordPattern =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
let emailpattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,4}$/;

let mobilePattern = /^\d{10}$/;
const firstNameValidator = ({ firstname }, ctx) => {
  let err = null;

  if (!firstname) {
    err = { message: "Enter first name", field: "firstname" };
    return err;
  }
  if (typeof firstname !== "string") {
    err = { message: "Enter Valid Firstname", field: "firstname" };
    return err;
  }

  firstname = firstname.trim();
  ctx.request.body.firstname = firstname;

  if (firstname.length < 3) {
    err = { message: "Minimum 3 characters required", field: "firstname" };
    return err;
  }
  if (firstname.length > 20) {
    err = { message: "Maximum 20 characters allowed", field: "firstname" };
    return err;
  }

  if (!namePattern.test(firstname)) {
    err = {
      message: "Firstname can only contain characters",
      field: "firstname",
    };
    return err;
  }

  return err;
};

const lastNameValidator = ({ lastname }, ctx) => {
  let err = null;

  if (!lastname) {
    err = { message: "Enter last name", field: "lastname" };
    return err;
  }
  if (typeof lastname !== "string") {
    err = { message: "Enter Valid lastname", field: "lastname" };
    return err;
  }

  lastname = lastname.trim();
  ctx.request.body.lastname = lastname;

  if (lastname.length < 3) {
    err = { message: "Minimum 3 characters required", field: "lastname" };
    return err;
  }
  if (lastname.length > 20) {
    err = { message: "Maximum 20 characters allowed", field: "lastname" };
    return err;
  }

  if (!namePattern.test(lastname)) {
    err = {
      message: "Firstname can only contain characters",
      field: "lastname",
    };
    return err;
  }

  return err;
};

const passwordValidator = ({ password }, ctx) => {
  let err = null;

  if (!password) {
    err = { message: "Enter password ", field: "password" };
    return err;
  }
  password = password.trim();
  ctx.request.body.password = password;

  if (!passwordPattern.test(password)) {
    err = {
      message:
        "Password Must be atleast 8 characters and contain atleast one Capital letter " +
        " ,One small letter " +
        " One number " +
        " one special symbol",
      field: "password",
    };
  }
  return err;
};
const confPasswordValidator = ({ password, cpassword }) => {
  let err = null;

  if (!cpassword) {
    err = { message: "Enter confirm password ", field: "cpassword" };
    return err;
  }

  if (cpassword !== password) {
    err = {
      message: "Password and Confirm password is not Equal",
      field: "cpassword",
    };
    return err;
  }
  return err;
};

const emailValidator = ({ email }) => {
  let err = null;

  if (!email) {
    err = {
      message: "Invalid user email",
      field: "email",
    };
    return err;
  }

  if (!emailpattern.test(email)) {
    err = {
      message: "Enter email",
      field: "email",
    };
    return err;
  }

  return err;
};

const genderValidator = ({ gender }) => {
  let err = null;

  if (!gender) {
    err = {
      message: "Enter user gender",
      field: "gender",
    };
    return err;
  }
  if (gender !== "m" && gender !== "f") {
    err = {
      message: "Gender Must be 'Male' or 'Female'",
      field: "Gender",
    };
    return err;
  }

  return err;
};
const mobileValidator = ({ mobile }, ctx) => {
  let err = null;

  if (!mobile) {
    err = {
      message: "Enter mobile",
      field: "mobile",
    };
    return err;
  }
  if (typeof mobile !== "string") {
    err = { message: "Enter Valid mobile", field: "mobile" };
    return err;
  }
  mobile = mobile.trim();
  ctx.request.body.mobile = mobile;

  if (!mobilePattern.test(mobile)) {
    err = {
      message: "Mobile musthave only 10 digits no Characters",
      field: "mobile",
    };
    return err;
  }

  return err;
};
const bdayValidator = ({ bday }, ctx) => {
  let err = null;
  let age;
  if (!bday) {
    err = {
      message: "Enter Birthdate",
      field: "bday",
    };
    return err;
  }

  let birth = new Date(bday);
  let currentDate = new Date();

  age = currentDate.getFullYear() - birth.getFullYear();

  if (
    currentDate.getMonth() < birth.getMonth() ||
    (currentDate.getMonth() === birth.getMonth() &&
      currentDate.getDate() < birth.getDate())
  ) {
    age--;
  }

  if (birth.getFullYear() > currentDate.getFullYear() || isNaN(age)) {
    err = {
      message: "Birthdate is not valid or can't be Future date",
      field: "bday",
    };
    return err;
  }
  ctx.request.body.age = age;
  return err;
};

const emailAlreadyExistsValidator = async ({ email }, ctx) => {
  let err = null;
  email = email.toLowerCase();

  const users = await getUserFromDbUsingEmail(email);
  if (users) {
    err = { message: "User already Exists", field: "email" };
    return err;
  }

  return err;
};

module.exports = {
  firstNameValidator,
  lastNameValidator,
  emailAlreadyExistsValidator,
  passwordValidator,
  confPasswordValidator,
  emailValidator,
  mobileValidator,
  genderValidator,
  bdayValidator,
};
