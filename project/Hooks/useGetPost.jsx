import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const UseGetPost = () => {
  const [helloMessage, setHelloMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/hello");
        setHelloMessage(response.data.message);
        setLoading(false);
      } catch (err) {
        setError("404 Not Found , Failed to get posts");
        setLoading(false);
      }
    };
    fetchHello();
  }, []);
  return {
    helloMessage,
    loading,
    error,
  };
};

export default UseGetPost;
