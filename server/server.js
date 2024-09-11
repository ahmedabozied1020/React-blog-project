const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routers
const postsRoute = require("./routers/posts");
const usersRoute = require("./routers/users");

const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

// time and methods function
app.use((req, res, next) => {
  console.log(req.method, req.url, new Date(Date.now()).toISOString());
  next();
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// handleRouters of Posts and Users
app.use("/posts", postsRoute);
app.use(usersRoute);

// error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An error occurred", error: err.message });
});

mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
});
