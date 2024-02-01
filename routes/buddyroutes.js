const {
  searchBuddy,
  requestBuddy,
  addBuddy,
  showBuddy,
  buddyChannels,
} = require("../controllers/buddy.controller");
const verifyToken = require("../middleware/verifyToken");
const router = require("koa-router")();

router.post("/request", verifyToken, requestBuddy);
router.get("/search", verifyToken, searchBuddy);
router.post("/add", addBuddy);
router.get("/showbuddy", verifyToken, showBuddy);
router.get("/buddychannels/:id", verifyToken, buddyChannels);

module.exports = router.routes();
