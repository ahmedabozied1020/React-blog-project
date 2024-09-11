import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
      <div className="w-full max-w-2xl space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-xl shadow">
            {post.image && (
              <img
                src={`http://localhost:3000/${post.image}`}
                alt="Post"
                className="mt-2 max-w-full h-auto rounded"
              />
            )}
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p>{post.description}</p>
            <Link
              to={`/postdetails/${post._id}`}
              state={{ post: post }}
              className="inline-flex items-center gap-3 bg-[#7808d0] text-white font-semibold py-3 px-6 pl-5 rounded-full transition-all duration-300 hover:bg-black hover:text-white group"
            >
              <span className="relative flex-shrink-0 w-6 h-6 bg-white text-[#7808d0] rounded-full grid place-items-center overflow-hidden transition-all duration-300 group-hover:bg-black group-hover:text-white">
                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 transition-transform duration-300 transform group-hover:translate-x-2 group-hover:-translate-y-2"
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  ></path>
                </svg>

                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  width="10"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute w-3 h-3 transition-transform duration-300 transform group-hover:translate-x-0 group-hover:translate-y-0"
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
              Explore
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
