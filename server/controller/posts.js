const fs = require("fs/promises");
const path = require("path");
const multer = require("multer");
const dataFilePath = path.join(__dirname, "../data.json");

exports.getPosts = async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    const posts = JSON.parse(data);
    res.json(posts);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.json([]);
    } else {
      console.error(error);
      res.status(500).send("An error occurred while fetching posts.");
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

exports.postPosts = [
  upload.single("image"),
  async (req, res) => {
    try {
      const post = req.body;
      console.log("Received body:", post);
      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }
      const posts = JSON.parse(await fs.readFile("data.json"));
      posts.push(post);
      await fs.writeFile("data.json", JSON.stringify(posts));
      res.send("post added");
    } catch (error) {
      console.error("Error:", error);
      res.status(400).send("Error adding post: " + error.message);
    }
  },
];

exports.patchPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = req.body;
    const posts = JSON.parse(await fs.readFile("data.json"));
    let postFound = false;
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        posts[i] = { ...posts[i], ...updatedPost };
        postFound = true;
        break;
      }
    }
    if (!postFound) {
      return res.status(404).send("post Not Found");
    }
    await fs.writeFile("./data.json", JSON.stringify(posts));
    res.send("posts updated");
  } catch (error) {
    console.log(error);
  }
};

exports.deletePosts = async (req, res) => {
  const { id } = req.params;
  const posts = JSON.parse(await fs.readFile("data.json"));
  const updatedPosts = posts.filter((post) => post.id !== id);
  await fs.writeFile("data.json", JSON.stringify(updatedPosts));
  res.send("post deleted");
};
