const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
} = require("../controller/posts");
const auth = require("./../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

///image upload to Upload Image in request
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
  },
});
const filter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    //image/png image/jpg
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// Initialize upload variable with the Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: filter,
});

// Route to handle image upload

router.post(
  "/",
  auth,
  upload.single("image"),
  (req, res, next) => {
    try {
      req.user.img = req.file.path;
      next();
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  createPost
);

router.get("/all", getAllPosts);
router.get("/", auth, getPosts);
router.get("/:id", auth, getPost);

router.patch("/:id", auth, upload.single("image"), updatePost);

router.delete("/:id", auth, deletePost);

module.exports = router;
