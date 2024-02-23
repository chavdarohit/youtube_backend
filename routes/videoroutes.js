const {
  videoList,
  videoLike,
  videoDislike,
  videoComment,
} = require("../controllers/video.controller");

const validate = require("../middleware/validate.middleware");
const verifyToken = require("../middleware/verifyToken");
const {
  alreadyvideoPresent,
  videoExists,
} = require("../validators/video.validator");

const router = require("koa-router")();

router.get("/list", verifyToken, videoList);
router.get(
  "/like/:videoId",
  verifyToken,
  validate([videoExists, alreadyvideoPresent]),
  videoLike
);
router.get(
  "/dislike/:videoId",
  verifyToken,
  validate([videoExists, alreadyvideoPresent]),
  videoDislike
);

router.post(
  "/comment/:videoId",
  verifyToken,
  validate([videoExists]),
  videoComment
);
module.exports = router.routes();
