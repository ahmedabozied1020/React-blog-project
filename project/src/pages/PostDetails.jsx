import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

const PostDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (location.state && location.state.post) {
        setPost(location.state.post);
      } else {
        try {
          const response = await axios.get(`http://localhost:3000/posts/${id}`);
          setPost(response.data);
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      }
    };

    fetchPost();
  }, [id, location.state]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-4/5 mx-auto flex flex-col items-center my-10 ">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow">
        {post.image && <img src={`http://localhost:3000/${post.image}`} alt="Post" className="w-full h-auto rounded-lg mb-4" />}
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg mb-6">{post.description}</p>
      </div>
    </div>
  );
};

export default PostDetails;
