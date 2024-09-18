const User = require("../models/users");
const Jwt = require("jsonwebtoken");
const util = require("util");

const jwtVerify = util.promisify(Jwt.verify);

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send("No token provided");
    }

    const tokenString = token.startsWith("Bearer ") ? token.slice(7) : token;

    const payload = await jwtVerify(tokenString, process.env.JWT_SECRET);
    console.log("Token payload:", payload);

    if (!payload.userId) {
      return res.status(401).send("Invalid token payload");
    }

    const user = await User.findById(payload.userId);
    console.log("User found:", user);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token expired");
    }
    res.status(500).send("Internal server error during authentication");
  }
};
