import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const UseGetPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts");
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError("404 Not Found , Failed to get posts");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return {
    posts,
    loading,
    error,
  };
};

export default UseGetPost;
