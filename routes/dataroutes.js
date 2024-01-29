const router = require("koa-router")();
const {
  viewProfile,
  suggestedChannels,
  subscribeChannel,
  viewSubscribedChannel,
} = require("../controllers/data.controller");
const verifyToken = require("../middleware/verifyToken");
const validateUser = require("../validators/signupvalidation");

router.get("/profile", verifyToken, viewProfile);
router.get("/suggested", verifyToken, suggestedChannels);
router.get("/subscribe/:id", verifyToken, subscribeChannel);
router.get("/viewsubscribed", verifyToken, viewSubscribedChannel);

module.exports = router.routes();
