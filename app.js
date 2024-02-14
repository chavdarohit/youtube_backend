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
// app.use(koaBody({ multipart: true }));
app.use(koaBody());
app.use(serve("./public"));
app.use(publicRouter.routes());
app.use(privateRouter.routes());

publicRouter.post("/", (ctx) => {
  ctx.body = "Hello World";
});

app.on("error", (err, ctx) => {
  console.error("Unhandled error occurred:", err);
  // You can cust omize the error response here
  ctx.status = 500;
  ctx.body = "Internal Server Error";
});

app.listen(80, () => {
  console.log(`Server is running on port 80...🚀`);
});

const connectToMongodb = async () => {
  try {
    await db.connectToDatabase();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

if (process.env.NODE_ENV !== "test") {
  // Connect to MongoDB only when not in test environment
  connectToMongodb();
}
module.exports = app;
