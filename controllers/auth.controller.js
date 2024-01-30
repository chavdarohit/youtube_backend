const bcrypt = require("bcrypt");
const db = require("../dbacess");
const makeJwtToken = require("../utils/MakeAuthToken");
const { userCollection } = require("../dbacess");
const { v4: uuidv4 } = require("uuid");
const signupInsert = async (ctx) => {
  let {
    firstname: fname,
    lastname: lname,
    password: pssd,
    cpassword: confpssd,
    email: email,
    mobile,
    gender: gender,
    bday: birthdate,
    age,
  } = ctx.request.body;

  try {
    let encryptedpssd = await bcrypt.hash(pssd, 10);
    let imagePath = ctx.file ? ctx.file.path : null;
    imagePath = imagePath?.split("\\")[1];

    const objdata = {
      firstname: fname,
      lastname: lname,
      password: encryptedpssd,
      email: email.toLowerCase(),
      mobile: mobile,
      gender,
      birthdate,
      age: age,
      image: imagePath,
      isPremium: false,
      channelsSubscribed: [],
      userId: uuidv4(),
    };
    console.log("Storging data = ", objdata);
    const ack = await db.signupInsert(objdata);
    const user = await userCollection.findOne({ userId: objdata.userId });
    const userId = user.userId;
    console.log("User retrieved ", user, userId);
    const token = makeJwtToken(userId);
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: "Registration succesfull",
      token,
      user,
    };
  } catch (err) {
    console.log("here in catch : ", err);
    ctx.status = 400;
    ctx.body = err.message || "An error occurred during registration";
  }
};

const loginUser = async (ctx) => {
  let { email, password } = ctx.request.body;
  email = email.toLowerCase();
  const userExists = await userCollection.findOne({ email });

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
    const token = makeJwtToken(userExists.userId);
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
