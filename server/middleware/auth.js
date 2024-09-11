const User = require("../models/users");
const Jwt = require("jsonwebtoken");
const util = require("util");

const jwtVerify = util.promisify(Jwt.verify);

module.exports = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    console.log(payload);
    const user = await User.findById(payload.userId);
    console.log(user);
    if (!user) return res.status(401).send("unauthorized");
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
