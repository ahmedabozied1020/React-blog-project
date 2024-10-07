const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server: socketServer } = require("socket.io");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// routers
const postsRoute = require("./routers/posts");
const usersRoute = require("./routers/users");

const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new socketServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

const connectedUsers = new Map();
const userNameToId = new Map();

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

// socket chat
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authntication Error"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error("JWT verification error:", error);
      return next(new Error("Authentication error"));
    }
    console.log("Decoded token in socket middleware:", decoded);
    socket.userId = decoded.userId;
    socket.userName = decoded.name;
    console.log("Socket user info:", { userId: socket.userId, userName: socket.userName });
    next();
  });
});
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userName || "Unknown"} (ID: ${socket.userId || "undefined"})`);
  if (socket.userId && socket.userName) {
    connectedUsers.set(socket.userId, socket);
    userNameToId.set(socket.userName, socket.userId);
  } else {
    console.error("Connected socket has no userId or userName");
  }
  socket.on("privateMessage", ({ content, to }) => {
    const receiverId = userNameToId.get(to.toLowerCase());
    const receiverSocket = connectedUsers.get(receiverId);
    if (receiverSocket) {
      receiverSocket.emit("privateMessage", { content, from: socket.userId, fromName: socket.userName });
      socket.emit("privateMessage", { content, to: receiverId, toName: to });
    } else {
      socket.emit("error", { message: "User not found" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userName} (ID: ${socket.userId})`);
    connectedUsers.delete(socket.userId);
    userNameToId.delete(socket.userName.toLowerCase());
  });
});

mongoose.connect(process.env.DB_URL).then(() => {
  server.listen(3000, () => {
    console.log("server is running on port 3000");
  });
});
