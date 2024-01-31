const router = require("koa-router")();
const buddyroutes = require("./buddyroutes");
const datarouter = require("./dataroutes");

router.use("/api/data", datarouter);
router.use("/api/buddy", buddyroutes);

module.exports = router;
