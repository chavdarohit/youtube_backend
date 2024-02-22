const koa = require("koa");
const serve = require("koa-static");
const app = new koa();
const publicRouter = require("./routes/publicroutes");
const privateRouter = require("./routes/privateroutes");
const db = require("./config/dbconfig");
const { koaBody } = require("koa-body");
const cors = require("koa-cors");

const corsOptions = {
  origin: "http://app.custom.local",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(koaBody());
app.use(serve("./public"));
app.use(publicRouter.routes());
app.use(privateRouter.routes());

const connectToMongodb = async () => {
  try {
    await db.connectToDatabase();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

if (process.env.NODE_ENV !== "test") {
  connectToMongodb();
}
module.exports = app;
