const { userCollection } = require("../config/dbconfig");
const { validateEmail } = require("./emailvalidation");

let age;
async function validateUser(ctx, next) {
  let {
    firstname: fname,
    lastname: lname,
    password: pssd,
    cpassword: confpssd,
    email,
    mobile,
    gender,
    bday: birthdate,
  } = ctx.request.body;

  try {
    if (!fname) {
      console.log("Firstname Required");
      throw new Error("Firstname Required");
    }
    if (!lname) {
      console.log("Lastname Required");
      throw new Error("Lastname Required");
    }
    if (!pssd) {
      console.log("Password Required");
      throw new Error("Password Required");
    }
    if (!confpssd) {
      console.log(" Confirm Password Required");
      throw new Error("Confirm Password Required");
    }
    if (!email) {
      console.log("Email Required");
      throw new Error("Email Required");
    }
    if (!mobile) {
      console.log("Mobile No Required");
      throw new Error("Mobile No Required");
    }
    if (!birthdate) {
      console.log("Birthdate Required");
      throw new Error("Birthdate Required");
    }
    if (!gender) {
      console.log("Gender Required");
      throw new Error("Gender Required");
    }

    let namePattern = /^[a-zA-Z]+$/;

    if (!namePattern.test(fname)) {
      console.log("Firstname can only contain characters");
      throw new Error("Firstname can only contain characters");
    }
    if (!namePattern.test(lname)) {
      console.log("Lastname can only contain characters");
      throw new Error("Lastname can only contain characters");
    }

    passwordPattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!passwordPattern.test(pssd) || !passwordPattern.test(confpssd)) {
      console.log(
        "Password Must contain atleast one Capital letter " +
          " ,One small letter " +
          " One number " +
          " one special symbol"
      );
      throw new Error(
        "Password Must contain atleast one Capital letter " +
          " ,One small letter " +
          " One number " +
          " one special symbol"
      );
    }

    if (pssd !== confpssd) {
      console.log("Password and Confirm Password do not match");
      throw new Error("Password and Confirm Password do not match");
    }

    if (!validateEmail(email)) {
      console.log("Invalid email format");
      throw new Error("Invalid email format");
    }

    if (gender !== "m" && gender !== "f") {
      console.log("Gender Must be 'Male' or 'Femal");
      throw new Error("Gender Must be 'Male' or 'Female");
    }
    if (!validateMobile(mobile)) {
      console.log("Invalid mobile number it must have 10 valid digits");
      throw new Error("Invalid mobile number it must have 10 valid digits");
    }

    if (!validateAge(birthdate)) {
      console.log("Birthdate should be Valid");
      throw new Error("Birthdate should be Valid");
    }
    if (!(await validateEmailExists(email))) {
      console.log("User already exists");
      throw new Error("User already exists");
    }
    console.log("User verified in middleware");
    ctx.request.body.age = age;
    await next();
  } catch (error) {
    console.log("error in validation : ", error);
    ctx.status = 400;
    ctx.body = error.message || "validation error";
  }
}

module.exports = validateUser;

async function validateEmailExists(email) {
  email = email.toLowerCase();
  const users = await userCollection.findOne({ email: email });
  if (users) return false;
  return true;
}
function validateMobile(mobile) {
  mobilePattern = /^[0-9]{10}$/;
  if (
    mobile.toString().length === 10 &&
    !isNaN(parseInt(mobile)) &&
    mobilePattern.test(mobile)
  )
    return true;
  return false;
}
function validateAge(birthdate) {
  let birth = new Date(birthdate);
  let currentDate = new Date();

  age = currentDate.getFullYear() - birth.getFullYear();

  if (
    currentDate.getMonth() < birth.getMonth() ||
    (currentDate.getMonth() === birth.getMonth() &&
      currentDate.getDate() < birth.getDate())
  ) {
    age--;
  }

  if (birth.getFullYear() > currentDate.getFullYear() || isNaN(age))
    return false;

  return true;
}
