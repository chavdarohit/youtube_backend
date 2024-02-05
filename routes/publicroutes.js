const router = require("koa-router")();
const authrouter = require("./authroutes");

router.use("/api/auth", authrouter);
module.exports = router;
