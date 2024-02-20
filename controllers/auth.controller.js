const bcrypt = require("bcrypt");
const makeJwtToken = require("../utils/MakeAuthToken");
const { v4: uuidv4 } = require("uuid");
const userCollectionQueries = require("../queries/userCollectionQueries");
const signupInsert = async (ctx) => {
  let {
    firstname: fname,
    lastname: lname,
    password: pssd,
    email: email,
    mobile,
    gender: gender,
    bday: birthdate,
    age,
    image,
  } = ctx.request.body;

  try {
    let encryptedpssd = await bcrypt.hash(pssd, 10);

    const objdata = {
      firstname: fname,
      lastname: lname,
      password: encryptedpssd,
      email: email.toLowerCase().trim(),
      mobile: mobile,
      gender,
      birthdate,
      age: age,
      image,
      isPremium: false,
      channelsSubscribed: [],
      buddies: [],
      userId: uuidv4(),
    };
    console.log("Storging data = ", objdata);
    const ack = await userCollectionQueries.signup(objdata);
    const user = await userCollectionQueries.getUserFromDbUsingId(
      objdata.userId
    );
    const userId = objdata.userId;
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
  // console.log("on 65 ", userCollectionQueries.getUserFromDbUsingEmail);
  const userExists = await userCollectionQueries.getUserFromDbUsingEmail(email);
  if (!userExists) {
    ctx.status = 401;
    ctx.body = "Invalid credentials";
    console.log("user not exists");
    return;
  }
  const passwordMatch = await bcrypt.compare(password, userExists.password);

  if (!passwordMatch) {
    ctx.status = 401;
    ctx.body = "Invalid credentials";
    console.log("passssword not match");
    console.log("Invalid credentials");
    return;
  }

  const token = makeJwtToken(userExists.userId);
  ctx.status = 200;
  ctx.body = {
    message: "Login succesfull",
    token,
    user: userExists,
  };
  console.log("Login succesfull");
};

module.exports = { signupInsert, loginUser };
