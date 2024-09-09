const fs = require("fs/promises");
const path = require("path");
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

exports.postPosts = async (req, res) => {
  const post = req.body;
  const posts = JSON.parse(await fs.readFile("data.json"));
  posts.push(post);
  res.send("post added");
};

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
