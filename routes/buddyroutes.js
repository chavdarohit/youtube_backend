const {
  searchBuddy,
  requestBuddy,
  addBuddy,
  showBuddy,
  allChannels,
  mutualBuddy,
} = require("../controllers/buddy.controller");
const validate = require("../middleware/validate.middleware");
const verifyToken = require("../middleware/verifyToken");
const {
  checkBuddy,
  checkBuddyAlreadyExists,
} = require("../validators/buddy.validator");
const router = require("koa-router")();

router.post("/request", verifyToken, validate([checkBuddy]), requestBuddy);
router.get("/search", verifyToken, searchBuddy);
router.post("/add", validate([checkBuddyAlreadyExists]), addBuddy);
router.get("/showbuddy", verifyToken, showBuddy);

router.post("/allchannels", verifyToken, allChannels);
router.post("/mutualbuddy/:id", verifyToken, mutualBuddy);

module.exports = router.routes();
