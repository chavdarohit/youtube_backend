const router = require("koa-router")();
const buddyroutes = require("./buddyroutes");
const datarouter = require("./dataroutes");
const videorouter = require("./videoroutes");
const analyticsroutes = require("./analyticsroutes");

router.use("/api/data", datarouter);
router.use("/api/buddy", buddyroutes);
router.use("/api/video", videorouter);
router.use("/api/analytics", analyticsroutes);

module.exports = router;
