const bcrypt = require("bcrypt");
const db = require("../dbacess");
const makeJwtToken = require("../utils/MakeAuthToken");
const { collection } = require("../dbacess");

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
      email,
      mobile: mobile,
      gender,
      birthdate,
      age: age,
      image: imagePath,
      isPremium: false,
      channelsSubscribed: [],
    };
    const ack = await db.signupInsert(objdata);
    const userId = ack.insertedId.toHexString();
    const token = makeJwtToken(userId);
    objdata["_id"] = userId;
    console.log("Storging data = ", objdata);
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: "Registration succesfull",
      token,
      user: objdata,
    };
  } catch (err) {
    console.log("here in catch : ", err);
    ctx.status = 400;
    ctx.body = err.message || "An error occurred during registration";
  }
};

const loginUser = async (ctx) => {
  let { email, password } = ctx.request.body;
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
