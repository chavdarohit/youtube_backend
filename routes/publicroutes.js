const router = require("koa-router")();
const authrouter = require("./authroutes");

router.use(authrouter);

module.exports = router;
