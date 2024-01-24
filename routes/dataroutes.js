const router = require("koa-router")();
const { viewProfile } = require("../controllers/data.controller");
const verifyToken = require("../middleware/verifyToken");

router.get("/profile", verifyToken, viewProfile);

module.exports = router.routes();
