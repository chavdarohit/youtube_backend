const multer = require("@koa/multer");
const path = require("path");


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public");
  },
  filename(req, file, cb) {
    console.log(file);
    const fileName =
      Date.now() +
      path.parse(file.originalname).name +
      path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
