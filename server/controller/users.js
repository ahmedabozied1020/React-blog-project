const User = require("../models/users");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const util = require("util");
const Joi = require("joi");
require("dotenv").config();
const imagekit = require("../utils/imagekit");

const jwtSign = util.promisify(Jwt.sign);

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file;
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    let avatarUrl = null;
    if (avatar) {
      avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${avatar.filename}`;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("EMAIL IS ALREADY REGISTERED");
    const user = await User.create({ name, email, password: hashedPassword, role: "user", avatar: avatarUrl });
    res.status(201).send({ message: "User created ", user });
  } catch (err) {
    next(err);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send("EMAIL OR PASSWORD IS INVALID");
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      const tokenPayload = { userId: user._id.toString(), name: user.name };
      const token = await jwtSign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ message: "User logged in", token, userId: user._id.toString(), name: user.name, avatar: user.avatar });
    } else {
      res.status(400).send("EMAIL OR PASSWORD IS INVALID");
    }
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ message: "Users fetched", users });
  } catch (err) {
    next(err);
  }
};
