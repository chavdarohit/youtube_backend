const {
  searchBuddy,
  requestBuddy,
  addBuddy,
  showBuddy,
  buddyChannels,
  allChannels,
} = require("../controllers/buddy.controller");
const validate = require("../middleware/validate.middleware");
const verifyToken = require("../middleware/verifyToken");
const { checkBuddy } = require("../validators/buddy.validator");
const router = require("koa-router")();

router.post("/request", verifyToken, validate([checkBuddy]), requestBuddy);
router.get("/search", verifyToken, searchBuddy);
router.post("/add", addBuddy);
router.get("/showbuddy", verifyToken, showBuddy);

//depricated
// router.get("/buddychannels/:id", verifyToken, buddyChannels);
router.post("/allchannels", verifyToken, allChannels);

module.exports = router.routes();
