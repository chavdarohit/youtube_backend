const router = require("koa-router")();
const datarouter = require("./dataroutes");

router.use("/api/data", datarouter);

module.exports = router;
