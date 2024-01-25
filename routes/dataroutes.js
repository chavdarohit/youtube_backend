const router = require("koa-router")();
const {
  viewProfile,
  suggestedChannels,
  subscribeChannel,
} = require("../controllers/data.controller");
const verifyToken = require("../middleware/verifyToken");

router.get("/profile", verifyToken, viewProfile);
router.get("/suggested", verifyToken, suggestedChannels);
router.get("/subscribe", verifyToken, subscribeChannel);

module.exports = router.routes();
