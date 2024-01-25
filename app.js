const koa = require("koa");
const serve = require("koa-static");
const app = new koa();
const publicRouter = require("./routes/publicroutes");
const privateRouter = require("./routes/privateroutes");
const db = require("./dbacess");
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

app.listen(80, () => {
  console.log(`Server is running on port 80...🚀`);
});

(async () => {
  await db.connectToDatabase();
})();
