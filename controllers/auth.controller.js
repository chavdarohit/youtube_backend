// const bcrypt = require("bcrypt");
// const db = require("../dbacess");

// const signupInsert = async (ctx) => {
//   // console.log("req body= ", ctx.request.body);
//   let fname = ctx.request.body.firstname;
//   let lname = ctx.request.body.lastname;
//   let pssd = ctx.request.body.password;
//   let confpssd = ctx.request.body.cpassword;
//   let email = ctx.request.body.email;
//   let mno = ctx.request.body.mono;
//   let gender = ctx.request.body.gender;
//   let birthdate = ctx.request.body.bday;
//   let age;

//   async function validateUser(
//     fname,
//     lname,
//     pssd,
//     confpssd,
//     email,
//     mno,
//     birthdate
//   ) {
//     if (!(fname && lname && pssd && confpssd && email && mno && birthdate)) {
//       throw new Error("All fields are required");
//     }

//     if (pssd !== confpssd) {
//       console.log("Password and Confirm Password do not match");
//       throw new Error("Password and Confirm Password do not match");
//     }

//     if (!validateEmail(email)) {
//       console.log("Invalid email format");
//       throw new Error("Invalid email format");
//     }

//     if (!validateMobile(mno)) {
//       console.log("Invalid mobile number");
//       throw new Error("Invalid mobile number");
//     }

//     if (!validateAge(birthdate)) {
//       console.log("Birthdate should be Valid");
//       throw new Error("Birthdate should be Valid");
//     }
//     if (!validateEmailExists(email)) {
//       console.log("User already exists");
//       throw new Error("User already exists");
//     }

//     return true;

//     function validateEmailExists(email) {
//       const users = db.getDataWithEmail(email);
//       if (users) return false;
//       else return true;
//     }

//     function validateMobile(mno) {
//       if (mno.toString().length === 10 && !isNaN(parseInt(mno))) return true;
//       else return false;
//     }
//     function validateAge(birthdate) {
//       let birth = new Date(birthdate);
//       let currentDate = new Date();

//       if (birth.getFullYear() > currentDate.getFullYear()) {
//         // console.log(
//         //   "Birth year =",
//         //   birth.getFullYear(),
//         //   "current year = ",
//         //   currentDate.getFullYear()
//         // );
//         return false;
//       }

//       age = currentDate.getFullYear() - birth.getFullYear();

//       if (
//         currentDate.getMonth() < birth.getMonth() ||
//         (currentDate.getMonth() === birth.getMonth() &&
//           currentDate.getDate() < birth.getDate())
//       ) {
//         age--;
//       }
//       return true;
//     }

//     function validateEmail(email) {
//       let pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,4}$/;
//       return pattern.test(email);
//     }
//   }

//   try {
//     if (
//       await validateUser(fname, lname, pssd, confpssd, email, mno, birthdate)
//     ) {
//       let encryptedpssd = await bcrypt.hash(pssd, 10);
//       console.log("Age is ", age);
//       const objdata = {
//         firstname: fname,
//         lastname: lname,
//         password: encryptedpssd,
//         email,
//         mobile: mno,
//         gender,
//         birthdate,
//         age: age,
//       };
//       await db.signupInsert(objdata);
//       ctx.body = "Registration succesfull";
//     }
//   } catch (err) {
//     ctx.status = 400;
//     ctx.body = err.message || "An error occurred during registration";
//   }
// };

// module.exports = signupInsert;
