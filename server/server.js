const express = require("express");
const postsRoute = require("./routers/posts");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/posts", postsRoute);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
