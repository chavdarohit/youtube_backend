const bcrypt = require("bcrypt");
const db = require("../dbacess");
const makeJwtToken = require("../utils/MakeAuthToken");
const { collection } = require("../dbacess");

const signupInsert = async (ctx) => {
  console.log("req body= ", ctx.request.body);
  let age;
  let {
    firstname: fname,
    lastname: lname,
    password: pssd,
    cpassword: confpssd,
    email: email,
    mono: mno,
    gender: gender,
    bday: birthdate,
  } = ctx.request.body;

  async function validateUser(
    fname,
    lname,
    pssd,
    confpssd,
    email,
    mno,
    birthdate,
    gender
  ) {
    if (
      !(
        fname &&
        lname &&
        pssd &&
        confpssd &&
        email &&
        mno &&
        birthdate &&
        gender
      )
    ) {
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
      throw new Error("Gender Must be 'Male' or 'Female");
    }
    if (!validateMobile(mno)) {
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

    return true;

    async function validateEmailExists(email) {
      const users = await db.getDataWithEmail(email);
      // console.log("User", users);
      if (users) return false;
      else return true;
    }
    function validateMobile(mno) {
      if (mno.toString().length === 10 && !isNaN(parseInt(mno))) return true;
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

  try {
    if (
      await validateUser(
        fname,
        lname,
        pssd,
        confpssd,
        email,
        mno,
        birthdate,
        gender
      )
    ) {
      let encryptedpssd = await bcrypt.hash(pssd, 10);
      console.log("Age is ", age);
      const objdata = {
        firstname: fname,
        lastname: lname,
        password: encryptedpssd,
        email,
        mobile: mno,
        gender,
        birthdate,
        age: age,
      };
      const ack = await db.signupInsert(objdata);
      const userId = ack.insertedId.toHexString();
      const token = makeJwtToken(userId);
      ctx.body = { status: 200, message: "Registration succesfull", token };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message || "An error occurred during registration";
  }
};

const loginUser = async (ctx) => {
  let { email, password } = ctx.request.body;
  //   console.log("Email for login ", email, " Password for login", password);
  const userExists = await collection.findOne({ email });

  if (!userExists) {
    ctx.status = 401;
    ctx.body = "Invalid credentials";
    return;
  }
  const passwordMatch = await bcrypt.compare(password, userExists.password);
  if (!passwordMatch) {
    ctx.status = 401;
    ctx.body = "Invalid credentials";
    console.log("Invalid credentials");
  } else {
    const token = makeJwtToken(userExists._id.toHexString());
    ctx.body = {
      status: 200,
      message: "Login succesfull",
      token,
      user: userExists,
    };
    console.log("Login succesfull");
  }
};

module.exports = { signupInsert, loginUser };
