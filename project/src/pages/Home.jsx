import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/posts/all");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching all posts:", error);
    }
  };

  return (
    <div className="w-4/5 mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-bold my-6">All Posts</h1>
      <div className="w-full max-w-2xl space-y-4">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
