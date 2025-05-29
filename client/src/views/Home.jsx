import React from "react";
import { useEffect } from "react";
import api from "../services/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../services/socketContext";

function Home() {
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("join_group_server", (data) => {
      if (!data.ok) console.log(data.message);

      setGroupName("");
      setGroupPassword("");
      navigate("/group/" + data.group_id);
    });
  }, [socket]);

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const res = await api.get("/user");
        if (!res.data.ok) throw new Error(res.data.message);

        setUsers(res.data.users);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    gettingUser();
  }, []);

  const handleJoinGroup = async (e) => {
    e.preventDefault();

    socket.emit("join_group", { groupName, groupPassword });
  };

  return (
    <div className="home">
      <h1>Home</h1>
      <Link to="/creategroup" className="create_group">
        Create group
      </Link>

      <form onSubmit={handleJoinGroup}>
        <h3>Join group</h3>
        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Group password"
          value={groupPassword}
          onChange={(e) => setGroupPassword(e.target.value)}
        />
        <button type="submit">Join</button>
      </form>

      <ul className="users_list">
        {users.map((user) => (
          <li key={user.user_id} className="user">
            <Link to={`/user/${user.user_id}`}>
              <img
                src={
                  user.user_profile
                    ? `${import.meta.env.VITE_SERVER_URL}${user.user_profile}`
                    : "/no_user.png"
                }
                alt=""
              />
              <h2>{user.user_name}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
