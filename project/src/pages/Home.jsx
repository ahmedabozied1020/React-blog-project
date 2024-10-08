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
    <div className=" mx-auto py-10 px-6 flex gap-10 ">
      <div className=" w-1/5 h-full flex">
        <div className="w-4/5">
          <span className="text-xl flex px-3 py-3 gap-4 hover:bg-slate-300 rounded-2xl hover:cursor-pointer">
            <img src="support_4116211.png" alt="friends" className="w-7 h-7" />
            Friends
          </span>
          <span className="text-xl flex px-3 py-2 gap-4 hover:bg-slate-300 rounded-2xl hover:cursor-pointer ">
            <img src="watching_11919629.png" alt="watches" className="w-7 h-7" />
            Watches
          </span>
          <span className="text-xl flex px-3 py-2 gap-4 hover:bg-slate-300 rounded-2xl hover:cursor-pointer ">
            <img src="briefcase_7771335.png" alt="business" className="w-7 h-7" />
            Business
          </span>
          <span className="text-xl flex px-3 py-2 gap-4 hover:bg-slate-300 rounded-2xl hover:cursor-pointer ">
            <img src="marketplace_13887514.png" alt="Marketplace" className="w-7 h-7" />
            MarketPlace
          </span>
          <span className="text-xl flex px-3 py-2 gap-4 hover:bg-slate-300 rounded-2xl hover:cursor-pointer ">
            <img src="newspaper_5766922.png" alt="news" className="w-7 h-7" />
            News
          </span>
        </div>
      </div>
      <div className="space-y-8 w-[45%]">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>
            </div>
            {post.image && (
              <div className="relative h-96 overflow-hidden">
                <img
                  src={`http://localhost:3000/${post.image}`}
                  alt="Post"
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-500 cursor-pointer transition-transform duration-300 hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-500 cursor-pointer transition-transform duration-300 hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-green-500 cursor-pointer transition-transform duration-300 hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-500 cursor-pointer transition-transform duration-300 hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </div>
                <Link
                  to={`/postdetails/${post._id}`}
                  state={{ post: post }}
                  className="inline-flex items-center gap-2 bg-slate-700 text-white font-semibold py-2 px-4 rounded-full transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span>Explore</span>
                  <span className="relative flex-shrink-0 w-5 h-5 bg-white text-gray-400 rounded-full grid place-items-center overflow-hidden transform transition-transform duration-300 hover:rotate-45">
                    <svg
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                    >
                      <path
                        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
