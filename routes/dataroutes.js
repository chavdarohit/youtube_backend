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
const {
  firstNameValidator,
  lastNameValidator,
  genderValidator,
  mobileValidator,
  bdayValidator,
} = require("../validators/auth.validator");
const {
  channelPresentForSubscribe,
  channelPresentForUnsubscribe,
  channelPresentForBellIcon,
} = require("../validators/channel.validator");

const checkChannel = require("../validators/checkChannel");
const userUpdateValidator = require("../validators/userupdate.valdator");

router.get("/profile", verifyToken, viewProfile);
router.get("/suggested", verifyToken, suggestedChannels);
router.get(
  "/subscribe/:id",
  verifyToken,
  checkChannel,
  validate([channelPresentForSubscribe]),
  subscribeChannel
);
router.get(
  "/unsubscribe/:id",
  verifyToken,
  checkChannel,
  validate([channelPresentForUnsubscribe]),
  unsubscribeChannel
);
router.get("/viewsubscribed", verifyToken, viewSubscribedChannel);
router.get(
  "/bell/:id",
  verifyToken,
  checkChannel,
  validate([channelPresentForBellIcon]),
  pressBellIcon
);
router.get("/premium", verifyToken, makeUserPremium);
router.post(
  "/updateprofile",
  verifyToken,
  validate([
    firstNameValidator,
    lastNameValidator,
    genderValidator,
    mobileValidator,
    bdayValidator,
    userUpdateValidator,
  ]),
  updateprofile
);

module.exports = router.routes();
