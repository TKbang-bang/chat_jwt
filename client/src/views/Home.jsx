import React from "react";
import { useEffect } from "react";
import api from "../services/api";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="home">
      <h1>Home</h1>

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
