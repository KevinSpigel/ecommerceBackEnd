const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const router = Router();

// Multer test
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname + "../../public/img"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploader = multer({ storage });

router.post("/", uploader.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      error: "file not loaded",
    });
  }

  res.json({
    status: "success",
    data: req.file,
  });
});

module.exports = router;
