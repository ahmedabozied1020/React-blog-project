import React, { useEffect, useState } from "react";
import axios from "axios";

const CrudPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/posts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (editPost) {
        const response = await axios.patch(
          `http://localhost:3000/posts/${editPost._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("PATCH response:", response.data);
        setEditPost(null);
      } else {
        await axios.post("http://localhost:3000/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      setTitle("");
      setDescription("");
      setImage(null);
      fetchPosts();
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setImage(null);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  return (
    <div className="w-4/5 mx-auto flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-500 p-6 mt-10 rounded-xl">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Title of post"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full h-24"
            placeholder="What's on your mind?"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="file-input w-full"
          />
          <button type="submit" className="btn btn-primary w-full">
            {editPost ? "Update" : "Post"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl mt-8 space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p>{post.description}</p>
            {post.image && (
              <img
                src={`http://localhost:3000/${post.image}`}
                alt="Post"
                className="mt-2 max-w-full h-auto rounded"
              />
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => handleEdit(post)} className="btn btn-sm btn-primary">
                Edit
              </button>
              <button onClick={() => handleDelete(post._id)} className="btn btn-sm btn-error">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrudPost;
