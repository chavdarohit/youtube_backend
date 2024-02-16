const { verify } = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const { channelAnalytics } = require("../controllers/channel.controller");
const checkChannel = require("../validators/checkChannel");

const router = require("koa-router")();

router.get("/analytics/:id", verifyToken, checkChannel, channelAnalytics);

module.exports = router.routes();
