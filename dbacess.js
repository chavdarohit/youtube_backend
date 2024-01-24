const { MongoClient } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.MONGO_URI);
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
  } catch (err) {
    console.log("Error while inserting data = ", err);
  }
}

module.exports = {
  connectToDatabase,
  signupInsert,
  collection,
};
