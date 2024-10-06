module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.query.token;

    if (!token) {
      return res.status(401).send("No token provided");
    }

    const tokenString = token.startsWith("Bearer ") ? token.slice(7) : token;

    const payload = await jwtVerify(tokenString, process.env.JWT_SECRET);
    console.log("Decoded token in auth middleware:", payload);

    if (!payload.userId || !payload.name) {
      return res.status(401).send("Invalid token payload");
    }

    const user = await User.findById(payload.userId);
    console.log("User found:", user);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    req.token = tokenString;
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
