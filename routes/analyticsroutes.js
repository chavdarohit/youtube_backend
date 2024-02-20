const verifyToken = require("../middleware/verifyToken");
const {
  videoAnalytics,
  subscriberAnalytics,
} = require("../controllers/analytics.controller");
const checkChannel = require("../validators/checkChannel");

const router = require("koa-router")();

router.get("/video/:id", verifyToken, checkChannel, videoAnalytics);
router.get("/subscriber/:id", verifyToken, checkChannel, subscriberAnalytics);

module.exports = router.routes();
