const { collection } = require("../dbacess");

async function validateUser(ctx, next) {
  console.log("from pratham ", ctx.request.body);
  let age;
  let {
    firstname: fname,
    lastname: lname,
    password: pssd,
    cpassword: confpssd,
    email: email,
    mobile,
    gender: gender,
    bday: birthdate,
  } = ctx.request.body;

  if (
    !(
      fname &&
      lname &&
      pssd &&
      confpssd &&
      email &&
      mobile &&
      birthdate &&
      gender
    )
  ) {
    ctx.status = 401;
    ctx.body = "All fields are required";
    console.log("All fields are required");
    return;
    // throw new Error("All fields are required");
  }

  if (pssd !== confpssd) {
    ctx.status = 401;
    ctx.body = "Password and Confirm Password do not match";
    console.log("Password and Confirm Password do not match");
    return;
    // throw new Error("Password and Confirm Password do not match");
  }

  if (!validateEmail(email)) {
    ctx.status = 401;
    ctx.body = "Invalid email format";
    console.log("Invalid email format");
    return;
    // throw new Error("Invalid email format");
  }

  if (
    gender !== "male" &&
    gender !== "female" &&
    gender !== "Male" &&
    gender !== "other" &&
    gender !== "Other" &&
    gender !== "Female"
  ) {
    ctx.status = 401;
    ctx.body = "Gender Must be 'Male' or 'Femal";
    console.log("Gender Must be 'Male' or 'Femal");
    return;
    // throw new Error("Gender Must be 'Male' or 'Female");
  }
  if (!validateMobile(mobile)) {
    ctx.status = 401;
    ctx.body = "Invalid mobile number";
    console.log("Invalid mobile number");
    return;
    // throw new Error("Invalid mobile number");
  }

  if (!validateAge(birthdate)) {
    ctx.status = 401;
    ctx.body = "Birthdate should be Valid";
    console.log("Birthdate should be Valid");
    return;
    // throw new Error("Birthdate should be Valid");
  }
  if (!(await validateEmailExists(email))) {
    ctx.status = 401;
    ctx.body = "User already exists";
    console.log("User already exists");
    return;
    // throw new Error("User already exists");
  }
  console.log("User verified in middleware");
  ctx.request.body.age = age;
  next();
  
  async function validateEmailExists(email) {
    const users = await collection.findOne({ email: email });
    if (users) return false;
    else return true;
  }
  function validateMobile(mobile) {
    if (mobile.toString().length === 10 && !isNaN(parseInt(mobile)))
      return true;
    else return false;
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
    if (birth.getFullYear() > currentDate.getFullYear() || isNaN(age)) {
      return false;
    } else {
      return true;
    }
  }

  function validateEmail(email) {
    let pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,4}$/;
    return pattern.test(email);
  }
}

module.exports = validateUser;
