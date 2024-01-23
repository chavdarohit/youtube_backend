const koa = require("koa");
const app = new koa();
const publicRouter = require("./routes/publicroutes");
const db = require("./dbacess");
const { koaBody } = require("koa-body");
const cors = require("koa-cors");
const verifyToken = require("./middleware/verifyToken");

// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };
const corsOptions = {
  origin: "http://app.custom.local",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(koaBody());
app.use(publicRouter.routes());

// router.post("/", (ctx) => {
//   console.log("Cookies from Manav", ctx.cookies.get("token"));
//   ctx.cookies.set("token", "badlinakicookie", {
//     httpOnly: true,
//     sameSite: "none",
//     secure: false,
//   });
// });

async function userAuthentication(ctx) {
  console.log("user verified and reached next page");
  ctx.status = 200;
  ctx.body = "Server started user is authenticated";
}
publicRouter.post("/api/verify", verifyToken, userAuthentication);

// app.listen(3000, () => {
//   console.log(`Server is running on port 3000...🚀`);
// });
app.listen(80, () => {
  console.log(`Server is running on port 80...🚀`);
});

(async () => {
  await db.connectToDatabase();
})();
