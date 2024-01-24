const router = require("koa-router")();
const { loginUser, signupInsert } = require("../controllers/auth.controller");
const upload = require("../middleware/uploadImage");

router.post("/signup", upload.single("image"), signupInsert);
router.post("/login", loginUser);

module.exports = router.routes();
