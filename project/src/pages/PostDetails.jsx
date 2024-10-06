import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";

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
        <Link to="/">
          <button className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group" type="button">
            <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <span className="relative flex-shrink-0 w-6 h-6 bg-white text-[#7808d0] rounded-full grid place-items-center overflow-hidden transition-all duration-300 group-hover:bg-black group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="22px" width="22px" className="absolute transition-transform duration-300 transform group-hover:scale-75">
                  <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="currentColor"></path>
                  <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="currentColor"></path>
                </svg>
              </span>
            </div>
            <p className="translate-x-2">Go Back</p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PostDetails;
