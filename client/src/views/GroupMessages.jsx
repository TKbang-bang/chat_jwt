import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft } from "../utils/svg";
import { useSocket } from "../services/socketContext";

function GroupMessages() {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [group, setGroup] = useState({});
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const gettingMessages = async () => {
      try {
        const res = await api.get(`/group/${groupId}`);

        if (!res.data.ok) throw new Error(res.data.message);

        const fixedMessages = res.data.messages.map((message) => {
          const fixedDate = message.created_at.replace(" ", "T");
          const newMessage = {
            ...message,
            created_at: new Date(fixedDate).toTimeString().slice(0, 8),
          };

          return newMessage;
        });

        setGroup(res.data.group);
        setMessages(fixedMessages);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    gettingMessages();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("to_group_message_server", (data) => {
      const fixedDate = data.created_at.replace(" ", "T");
      data.created_at = new Date(fixedDate).toTimeString().slice(0, 8);
      setMessages((messages) => [...messages, data]);

      setMessage("");
    });

    return () => {
      socket.off("to_group_message_server");
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    socket.emit("group_message", { message, groupId });
  };

  const handleLeaveGroup = () => {
    socket.emit("leave_group", groupId);
    navigate("/");
  };

  return (
    <div className="principal messages">
      <div className="header">
        <span onClick={handleLeaveGroup}>
          <ArrowLeft />
        </span>
        <img src="/group.png" alt="" />
        <h2>{group.group_name}</h2>
      </div>

      <div className="messages_container">
        <ul className="messages_list">
          {messages.map((_message) => (
            <li key={_message.message_id} className={`message `}>
              <h3>{_message.user_name}</h3>
              <p>{_message.message_content}</p>
              <p className="date">{_message.created_at}</p>
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

export default GroupMessages;
