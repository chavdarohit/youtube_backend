const router = require("koa-router")();
const buddyroutes = require("./buddyroutes");
const datarouter = require("./dataroutes");
const videorouter = require("./videoroutes");

router.use("/api/data", datarouter);
router.use("/api/buddy", buddyroutes);
router.use("/api/video", videorouter);

module.exports = router;
