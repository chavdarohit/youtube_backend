const router = require("koa-router")();
const { loginUser, signupInsert } = require("../controllers/auth.controller");

router.post("/api/signup", signupInsert);
router.post("/api/login", loginUser);

module.exports = router.routes();
