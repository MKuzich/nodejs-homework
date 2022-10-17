const multer = require("multer");
const path = require("path");
const uuid = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./tmp"));
  },
  filename: (req, file, cb) => {
    const [, fileType] = file.originalname.split(".");
    const newFileName = uuid.v4();
    cb(null, `${newFileName}.${fileType}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
