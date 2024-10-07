const express = require("express");
const router = express.Router();
const { signUp, logIn, getUsers } = require("../controller/users");
const auth = require("../middleware/auth");
const restrictTo = require("../middleware/restirectTo");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Update the signup route to use multer middleware
router.post("/signup", upload.single("avatar"), signUp);
router.post("/login", logIn);

router.get("/users", auth, restrictTo("admin"), getUsers);

module.exports = router;
