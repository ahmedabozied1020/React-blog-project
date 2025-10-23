import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log("=== FETCHING USER POSTS ===");
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);

      const response = await axios.get("http://localhost:3000/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched posts:", response.data);
      console.log("Number of posts:", response.data.length);
      setPosts(response.data);
    } catch (error) {
      console.error(
        "Error fetching posts:",
        error.response?.data || error.message
      );
      setError("Failed to load posts");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("=== SUBMITTING POST ===");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Image:", image);
    console.log("Edit mode:", !!editPost);

    // Validation
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    if (image) {
      formData.append("image", image);
      console.log("Image added to form:", image.name);
    }

    // Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);

      if (editPost) {
        console.log("Updating post:", editPost._id);
        const response = await axios.patch(
          `http://localhost:3000/posts/${editPost._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Update response:", response.data);
        setEditPost(null);
      } else {
        console.log("Creating new post...");
        const response = await axios.post(
          "http://localhost:3000/posts",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Create response:", response.data);
      }

      // Clear form
      setTitle("");
      setDescription("");
      setImage(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      // Refetch posts
      console.log("Refetching posts...");
      await fetchPosts();

      console.log("✅ Post operation completed successfully");
    } catch (error) {
      console.error("❌ Error submitting post:");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Message:", error.message);
      setError(error.response?.data?.error || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    console.log("Editing post:", post._id);
    setEditPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setImage(null);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      console.log("Deleting post:", postId);
      await axios.delete(`http://localhost:3000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("✅ Post deleted");
      await fetchPosts();
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response?.data || error.message
      );
      setError("Failed to delete post");
    }
  };

  const handleCancelEdit = () => {
    setEditPost(null);
    setTitle("");
    setDescription("");
    setImage(null);
  };

  return (
    <div className="w-4/5 mx-auto flex flex-col items-center min-h-screen py-10">
      {/* Create/Edit Post Form */}
      <div className="w-full max-w-2xl bg-gray-500 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          {editPost ? "Edit Post" : "Create New Post"}
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Title of post"
            disabled={loading}
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full h-24"
            placeholder="What's on your mind?"
            disabled={loading}
            required
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="file-input w-full"
            accept="image/*"
            disabled={loading}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300">
                <div className="absolute inset-0 transform translate-x-[-100%] bg-gradient-to-r from-lime-500 to-green-600 group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </div>

              <div className="relative flex items-center justify-center gap-2 transform group-hover:scale-105 transition-transform duration-300">
                <span>
                  {loading
                    ? "Saving..."
                    : editPost
                    ? "Update Post"
                    : "Create Post"}
                </span>

                {!loading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                )}
              </div>
            </button>

            {editPost && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="w-full max-w-2xl mt-8 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Your Posts ({posts.length})</h2>

        {posts.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-500">
              No posts yet. Create your first post!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.description}</p>

              {post.image && (
                <img
                  src={`http://localhost:3000/${post.image}`}
                  alt={post.title}
                  className="mt-2 w-full h-auto rounded-lg object-cover max-h-96"
                  onError={(e) => {
                    console.error("Image failed to load:", post.image);
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;
