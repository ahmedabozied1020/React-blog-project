const Post = require("../models/posts");
const Jwt = require("jsonwebtoken");
const util = require("util");
require("dotenv").config();

exports.getPosts = async (req, res) => {
  try {
    console.log("User ID from token:", req.user._id);
    const posts = await Post.find({ userId: req.user._id });
    console.log("Found posts:", posts);
    res.send(posts);
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).send({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); 
    res.send(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).send({ error: error.message });
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const body = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : undefined;
    const post = await Post.create({
      ...body,
      userId: req.user._id,
      image: imagePath,
    });
    await post.save();
    res.status(201).send({ message: "post added", post });
  } catch (err) {
    console.error("Error in createPost:", err);
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedPost = req.body;

    if (req.file) {
      updatedPost.image = req.file.path.replace(/\\/g, "/");
    }

    const post = await Post.findOneAndUpdate({ _id: id, userId: req.user._id }, updatedPost, {
      new: true,
    });

    if (!post) {
      return res
        .status(404)
        .send({ message: "Post not found or you're not authorized to update it" });
    }

    res.send(post);
  } catch (err) {
    console.error("Error in updatePost:", err);
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Post.findOneAndDelete({ _id: id, userId: req.user._id });
    res.send("post deleted");
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (req.user._id.toString() === post.userId.toString()) {
      res.send(post);
    } else {
      res.status(403).send({ message: "forbidden" });
    }
  } catch (err) {
    next(err);
  }
};
