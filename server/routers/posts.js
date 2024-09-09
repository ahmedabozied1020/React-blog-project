const express = require("express");
const router = express.Router();
const { postPosts, getPosts, patchPosts, deletePosts } = require("../controller/posts");

router.post("/", postPosts);

router.get("/", getPosts);

router.patch("/:id", patchPosts);

router.delete("/:id", deletePosts);

module.exports = router;
