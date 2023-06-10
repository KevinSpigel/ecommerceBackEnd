const multer = require("multer");

const destinationFolders = {
  thumbnail: "products",
  documents: "documents",
  profile_image: "profiles",
};

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.headers;
    const destinationFolder = destinationFolders[type] || "missDocs";

    cb(null, process.cwd() + `/src/public/assets/${destinationFolder}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

module.exports = multer({ storage });

// // Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, process.cwd() + "/src/public/img");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// module.exports = multer({ storage });
