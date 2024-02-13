const { MongoClient } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.MONGO_URI);
const database = client.db("youtube-project");
const userCollection = database.collection("users");
const buddyCollection = database.collection("buddy");
const suggestedCollection = database.collection("suggested");
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB local");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = {
  connectToDatabase,
  userCollection,
  suggestedCollection,
  buddyCollection
};
