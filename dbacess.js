const { MongoClient } = require("mongodb");
require("dotenv").config();

let uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

const database = client.db("youtube-project");
const collection = database.collection("users");

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

async function signupInsert(obj) {
  try {
    const ack = await collection.insertOne(obj);
  
    console.log("Data inserted ", ack);
    return ack;
  } finally {
    // await client.close();
    // console.log("Connection close");
  }
}

async function getDataWithEmail(email) {
  let user;
  try {
    user = await collection.findOne({ email: email });
    // console.log("User from db", user);
    return user;
  } catch (err) {
    console.log("Error reading all data from database");
  }
}

module.exports = {
  connectToDatabase,
  signupInsert,
  getDataWithEmail,
};
