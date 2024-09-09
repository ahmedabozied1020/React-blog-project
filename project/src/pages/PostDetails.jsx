import React from "react";
import { useLocation, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { image, description } = location.state || {};

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {image && <img src={image} alt="Post" className="w-full h-64 object-cover object-center" />}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Post Details</h1>
          <div className="p-6">
            <p className="text-gray-700 text-base mb-4">{description}</p>
            <p className="text-gray-600">Post ID: {id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
