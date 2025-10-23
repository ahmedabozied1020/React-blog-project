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

// Ensure uploads directory exists
const uploadsDir = "./uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory");
}

// Image upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const filter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// PUBLIC ROUTES
router.get("/all", getAllPosts);

// PROTECTED ROUTES
router.get("/", auth, getPosts);
router.get("/:id", auth, getPost);

// CREATE POST - FIXED! Remove the problematic middleware
router.post("/", auth, upload.single("image"), createPost);

// UPDATE POST
router.patch("/:id", auth, upload.single("image"), updatePost);

// DELETE POST
router.delete("/:id", auth, deletePost);

module.exports = router;
