const router = require("koa-router")();
const {
  viewProfile,
  suggestedChannels,
  subscribeChannel,
  viewSubscribedChannel,
  pressBellIcon,
  makeUserPremium,
  unsubscribeChannel,
  updateprofile,
} = require("../controllers/data.controller");
const validate = require("../middleware/validate.middleware");
const verifyToken = require("../middleware/verifyToken");
const firstNameValidator = require("../validators/auth.validator");
const checkChannel = require("../validators/checkChannel");

router.get("/profile", verifyToken, viewProfile);
router.get("/suggested", verifyToken, suggestedChannels);
router.get("/subscribe/:id", verifyToken, checkChannel, subscribeChannel);
router.get("/unsubscribe/:id", verifyToken, checkChannel, unsubscribeChannel);
router.get("/viewsubscribed", verifyToken, viewSubscribedChannel);
router.get("/bell/:id", verifyToken, checkChannel, pressBellIcon);
router.get("/premium", verifyToken, makeUserPremium);
router.post(
  "/updateprofile",
  verifyToken,
  validate([firstNameValidator]),
  updateprofile
);

module.exports = router.routes();
