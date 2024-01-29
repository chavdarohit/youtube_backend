const { userCollection } = require("../dbacess");

let age;
async function validateUser(ctx, next) {
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

  try {
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
      console.log("All fields are required");
      throw new Error("All fields are required");
    }

    if (pssd !== confpssd) {
      console.log("Password and Confirm Password do not match");
      throw new Error("Password and Confirm Password do not match");
    }

    if (!validateEmail(email)) {
      console.log("Invalid email format");
      throw new Error("Invalid email format");
    }

    if (
      gender !== "male" &&
      gender !== "female" &&
      gender !== "Male" &&
      gender !== "other" &&
      gender !== "Other" &&
      gender !== "Female"
    ) {
      console.log("Gender Must be 'Male' or 'Femal");
      throw new Error("Gender Must be 'Male' or 'Female");
    }
    if (!validateMobile(mobile)) {
      console.log("Invalid mobile number");
      throw new Error("Invalid mobile number");
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
  const users = await userCollection.findOne({ email: email });
  if (users) return false;
  else return true;
}
function validateMobile(mobile) {
  if (mobile.toString().length === 10 && !isNaN(parseInt(mobile))) return true;
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
    // console.log("here in false", age);
    return false;
  } else {
    // console.log("here in true", age);
    return true;
  }
}

function validateEmail(email) {
  let pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,4}$/;
  return pattern.test(email);
}

// async function validateUser(
//   fname,
//   lname,
//   pssd,
//   confpssd,
//   email,
//   mobile,
//   birthdate,
//   gender
// ) {
//   if (
//     !(
//       fname &&
//       lname &&
//       pssd &&
//       confpssd &&
//       email &&
//       mobile &&
//       birthdate &&
//       gender
//     )
//   ) {
//     throw new Error("All fields are required");
//   }

//   if (pssd !== confpssd) {
//     console.log("Password and Confirm Password do not match");
//     throw new Error("Password and Confirm Password do not match");
//   }

//   if (!validateEmail(email)) {
//     console.log("Invalid email format");
//     throw new Error("Invalid email format");
//   }

//   if (
//     gender !== "male" &&
//     gender !== "female" &&
//     gender !== "Male" &&
//     gender !== "other" &&
//     gender !== "Other" &&
//     gender !== "Female"
//   ) {
//     throw new Error("Gender Must be 'Male' or 'Female");
//   }
//   if (!validateMobile(mobile)) {
//     console.log("Invalid mobile number");
//     throw new Error("Invalid mobile number");
//   }

//   if (!validateAge(birthdate)) {
//     console.log("Birthdate should be Valid");
//     throw new Error("Birthdate should be Valid");
//   }
//   if (!(await validateEmailExists(email))) {
//     console.log("User already exists");
//     throw new Error("User already exists");
//   }

//   return true;

//   async function validateEmailExists(email) {
//     const users = await userCollection.findOne({ email: email });
//     if (users) return false;
//     else return true;
//   }
//   function validateMobile(mobile) {
//     if (mobile.toString().length === 10 && !isNaN(parseInt(mobile)))
//       return true;
//     else return false;
//   }
//   function validateAge(birthdate) {
//     let birth = new Date(birthdate);
//     let currentDate = new Date();

//     age = currentDate.getFullYear() - birth.getFullYear();

//     if (
//       currentDate.getMonth() < birth.getMonth() ||
//       (currentDate.getMonth() === birth.getMonth() &&
//         currentDate.getDate() < birth.getDate())
//     ) {
//       age--;
//     }
//     if (birth.getFullYear() > currentDate.getFullYear() || isNaN(age)) {
//       return false;
//     } else {
//       return true;
//     }
//   }

//   function validateEmail(email) {
//     let pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,4}$/;
//     return pattern.test(email);
//   }
// }
