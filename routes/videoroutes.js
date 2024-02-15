const { videoList } = require("../controllers/video.controller");
const verifyToken = require("../middleware/verifyToken");

const router = require("koa-router")();

router.get("/list", verifyToken, videoList);

module.exports = router.routes();
