const router = require("koa-router")();
const { loginUser, signupInsert } = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const {
  firstNameValidator,
  lastNameValidator,
  passwordValidator,
  confPasswordValidator,
  emailValidator,
  genderValidator,
  mobileValidator,
  bdayValidator,
  emailAlreadyExistsValidator,
} = require("../validators/auth.validator");
router.post(
  "/signup",
  validate([
    firstNameValidator,
    lastNameValidator,
    passwordValidator,
    confPasswordValidator,
    emailValidator,
    emailAlreadyExistsValidator,
    genderValidator,
    mobileValidator,
    bdayValidator,
  ]),
  signupInsert
);
router.post("/login", validate([emailValidator]), loginUser);

module.exports = router.routes();
