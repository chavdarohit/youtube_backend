const router = require("koa-router")();
const {
  viewProfile,
  suggestedChannels,
  subscribeChannel,
  viewSubscribedChannel,
  pressBellIcon,
  makeUserPremium,
} = require("../controllers/data.controller");
const verifyToken = require("../middleware/verifyToken");

router.get("/profile", verifyToken, viewProfile);
router.get("/suggested", verifyToken, suggestedChannels);
router.get("/subscribe/:id", verifyToken, subscribeChannel);
router.get("/viewsubscribed", verifyToken, viewSubscribedChannel);
router.get("/bell/:id", verifyToken, pressBellIcon);
router.get("/premium", verifyToken, makeUserPremium);

module.exports = router.routes();
