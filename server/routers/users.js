const express = require("express");
const router = express.Router();
const { signUp, logIn, getUsers } = require("../controller/users");
const auth = require("../middleware/auth");
const restrictTo = require("../middleware/restirectTo");

router.post("/signup", signUp);
router.post("/login", logIn);

router.get("/users", auth, restrictTo("admin"), getUsers);

module.exports = router;
