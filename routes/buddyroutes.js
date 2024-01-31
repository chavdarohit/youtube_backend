const { addBuddy, searchBuddy } = require("../controllers/buddy.controller");
const router = require("koa-router")();

router.post("/add", addBuddy);
router.post("/search", searchBuddy);

module.exports = router.routes();
