// App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Sign from "./views/Sign";
import UsersMessages from "./views/UsersMessages";
import api from "./services/api.js";
import { setAccessToken, removeAccessToken } from "./services/token.service";
import { SocketProvider } from "./services/socketContext.jsx";
import axios from "axios";
import CreateGroup from "./views/CreateGroup.jsx";

axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}`;
axios.defaults.withCredentials = true;

function App() {
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const res = await api.get("/verify");
        const newAccessToken = res.headers["access-token"]?.split(" ")[1];
        if (newAccessToken) {
          setAccessToken(newAccessToken);
        }
      } catch (err) {
        removeAccessToken();
        if (window.location.pathname !== "/sign") {
          window.location.href = "/sign";
        }
      }
    };

    restoreToken();
  }, []);

  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/user/:userId" element={<UsersMessages />} />
        <Route path="/creategroup" element={<CreateGroup />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
