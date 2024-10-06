import React, { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import io from "socket.io-client";

let socket;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    socket = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("privateMessage", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: message._id,
          text: message.content,
          sender: message.from ? message.fromName : "me",
          recipient: message.to ? message.toName : message.fromName,
          timestamp: message.timestamp,
        },
      ]);
    });

    socket.on("previousMessages", (messages) => {
      setMessages(
        messages.map((msg) => ({
          id: msg._id,
          text: msg.content,
          sender: msg.sender === userName ? "me" : msg.sender,
          recipient: msg.recipient === userName ? "me" : msg.recipient,
          timestamp: msg.timestamp,
        }))
      );
    });

    socket.on("error", (error) => {
      setError(error.message);
    });

    return () => {
      socket.off("privateMessage");
      socket.off("previousMessages");
      socket.off("error");
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== "" && recipient.trim() !== "") {
      socket.emit("privateMessage", {
        content: inputMessage,
        to: recipient,
      });
      setInputMessage("");
      setError("");
    }
  };

  const handleRecipientChange = (e) => {
    const newRecipient = e.target.value;
    setRecipient(newRecipient);
    setError("");
    if (newRecipient.trim() !== "") {
      socket.emit("fetchMessages", { otherUserName: newRecipient });
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gray-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-300">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              <p className="font-bold">{message.sender === "me" ? `To: ${message.recipient}` : `From: ${message.sender}`}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-500">
        <div className="flex space-x-4 justify-center">
          <input
            type="text"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Recipient Name"
            className="w-1/4 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-1/2 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <IoMdSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
