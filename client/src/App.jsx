import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home.jsx";
import Sign from "./views/Sign";
import axios from "axios";
import { useEffect } from "react";
import api from "./services/api.js";
import { removeAccessToken, setAccessToken } from "./services/token.service.js";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}`;

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign" element={<Sign />} />
    </Routes>
  );
}

export default App;
