const router = require("koa-router")();
const { loginUser, signupInsert } = require("../controllers/auth.controller");
const upload = require("../middleware/uploadImage");
const { validateEmailid } = require("../validators/emailvalidation");
const validateUser = require("../validators/signupvalidation");

router.post("/signup", upload.single("image"), validateUser, signupInsert);
router.post("/login", validateEmailid, loginUser);


module.exports = router.routes();
