import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../services/socketContext.jsx";
import api from "../services/api.js";
import { ArrowLeft } from "../utils/svg.jsx";

function UsersMessages() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("to_user_message_server", (data) => {
      if (data.to_user_id === userId || data.from_user_id === userId) {
        data.created_at.replace(" ", "T");

        setMessages((messages) => [...messages, data]);
      }
    });

    return () => {
      socket.off("to_user_message_server");
    };
  }, [socket]);

  useEffect(() => {
    const gettingUserMessages = async () => {
      try {
        const res = await api.get(`/user/${userId}`);
        if (!res.data.ok) throw new Error(res.data.message);

        const fixedMessages = res.data.messages.map((message) => {
          const fixedDate = message.created_at.replace(" ", "T");
          const newMessage = {
            ...message,
            created_at: new Date(fixedDate).toTimeString().slice(0, 8),
          };

          return newMessage;
        });

        setUser(res.data.user);
        setMessages(fixedMessages);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    gettingUserMessages();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("to_user_message", { message, to_user_id: userId });
      setMessage("");
    }
  };

  return (
    <div className="principal messages">
      <div className="header">
        <span onClick={() => navigate(-1)}>
          <ArrowLeft />
        </span>
        <img
          src={
            user.user_profile
              ? `${import.meta.env.VITE_SERVER_URL}${user.user_profile}`
              : `/no_user.png`
          }
          alt=""
        />
        <h2>{user.user_name}</h2>
      </div>

      <div className="messages_container">
        <ul className="messages_list">
          {messages.map((message) => (
            <li
              key={message.message_id}
              className={`message ${
                message.from_user_id == userId ? "left" : "right"
              }`}
            >
              <h3>{message.from_user_id == userId ? user.user_name : "You"}</h3>
              <p>{message.message_content}</p>
              <p className="date">{message.created_at}</p>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default UsersMessages;
