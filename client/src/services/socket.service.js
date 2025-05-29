import { io } from "socket.io-client";
import api from "./api";

const socketService = async () => {
  try {
    const res = await api.get("/verify");

    if (res.data.ok) {
      const token = res.data.accessToken;
      if (!token) throw new Error("No access token available");

      const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
        withCredentials: true,
        auth: {
          token,
        },
      });

      return socket;
    }
  } catch (err) {
    console.error("Socket error: " + err);
  }

  return null;
};

export default socketService;
