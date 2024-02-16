const router = require("koa-router")();
const buddyroutes = require("./buddyroutes");
const channelroutes = require("./channelroutes");
const datarouter = require("./dataroutes");
const videorouter = require("./videoroutes");

router.use("/api/data", datarouter);
router.use("/api/buddy", buddyroutes);
router.use("/api/video", videorouter);
router.use("/api/channel", channelroutes);

module.exports = router;
