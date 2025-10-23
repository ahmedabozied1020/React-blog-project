require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server: socketServer } = require("socket.io");
const jwt = require("jsonwebtoken");

// routers
const postsRoute = require("./routers/posts");
const usersRoute = require("./routers/users");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL, "http://localhost:5173"]
      : "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/debug/db-info", async (req, res) => {
  try {
    const Post = require("./models/posts");
    const User = require("./models/users");

    res.json({
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.db.databaseName,
      host: mongoose.connection.host,
      collections: await mongoose.connection.db.listCollections().toArray(),
      postCount: await Post.countDocuments(),
      userCount: await User.countDocuments(),
      samplePosts: await Post.find().limit(3),
      sampleUsers: await User.find().select("-password").limit(3),
    });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.get("/debug/test-user", async (req, res) => {
  try {
    const User = require("./models/users");
    const bcrypt = require("bcryptjs");

    const hashedPassword = await bcrypt.hash("test123", 10);

    const testUser = await User.create({
      name: "Debug User " + Date.now(),
      email: "debug" + Date.now() + "@test.com",
      password: hashedPassword,
      role: "user",
    });

    console.log("✅ Test user created:", testUser._id);

    res.json({
      success: true,
      message: "Test user created!",
      user: { id: testUser._id, name: testUser.name, email: testUser.email },
      database: mongoose.connection.db.databaseName,
    });
  } catch (error) {
    console.error("❌ Test user creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
});

app.get("/debug/test-post", async (req, res) => {
  try {
    const Post = require("./models/posts");
    const User = require("./models/users");

    // Get or create a user
    let user = await User.findOne();
    if (!user) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("test123", 10);
      user = await User.create({
        name: "Test User",
        email: "testuser@test.com",
        password: hashedPassword,
        role: "user",
      });
    }

    // Create a test post
    const testPost = await Post.create({
      title: "Debug Post " + Date.now(),
      description:
        "This is a debug post created at " + new Date().toISOString(),
      userId: user._id,
    });

    console.log("✅ Test post created:", testPost._id);

    res.json({
      success: true,
      message: "Test post created!",
      post: testPost,
      database: mongoose.connection.db.databaseName,
    });
  } catch (error) {
    console.error("❌ Test post creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
});

// Socket.io setup
const io = new socketServer(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL, "http://localhost:5173"]
        : "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const connectedUsers = new Map();
const userNameToId = new Map();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Test endpoints
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from backend!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    cors: "enabled",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000,
  });
});

// API Routes (ONLY ONCE!)
app.use("/posts", postsRoute);
app.use(usersRoute);

// Error handling middleware (at the end)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "An error occurred",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Socket.io authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication Error"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error("JWT verification error:", error);
      return next(new Error("Authentication error"));
    }
    socket.userId = decoded.userId;
    socket.userName = decoded.name;
    next();
  });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userName} (ID: ${socket.userId})`);

  if (socket.userId && socket.userName) {
    connectedUsers.set(socket.userId, socket);
    userNameToId.set(socket.userName.toLowerCase(), socket.userId);
  }

  socket.on("privateMessage", ({ content, to }) => {
    const receiverId = userNameToId.get(to.toLowerCase());
    const receiverSocket = connectedUsers.get(receiverId);

    if (receiverSocket) {
      receiverSocket.emit("privateMessage", {
        content,
        from: socket.userId,
        fromName: socket.userName,
      });
      socket.emit("privateMessage", { content, to: receiverId, toName: to });
    } else {
      socket.emit("error", { message: "User not found" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userName} (ID: ${socket.userId})`);
    connectedUsers.delete(socket.userId);
    if (socket.userName) {
      userNameToId.delete(socket.userName.toLowerCase());
    }
  });
});

const PORT = process.env.PORT || 3000;

console.log("=== SERVER STARTUP ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("DB_URL:", process.env.DB_URL ? "✓ Set" : "✗ Not set");

// MongoDB connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("Database:", mongoose.connection.db.databaseName);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log("🚀 Server ready to accept connections");
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
