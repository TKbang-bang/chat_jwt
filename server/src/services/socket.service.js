import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

const socketService = (server) => {
  const io = new Server(server, {
    cors: {
      origin: `${process.env.CLIENT_URL}`,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token given"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userID = decoded.userID;
      next();
    } catch (err) {
      console.log("Invalid token", err.message);
      return next(new Error("Invalid token"));
    }
  });

  const userSockets = new Map();

  io.on("connection", (socket) => {
    // user id from jwt
    const userID = socket.userID;
    userSockets.set(userID, socket.id);
    // show the user id when a user connects
    console.log(`Usuario conectado: ${socket.userID}`);

    socket.on("to_user_message", async (data) => {
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

      const completeMessage = {
        message_id: crypto.randomUUID(),
        from_user_id: userID,
        to_user_id: data.to_user_id,
        message_content: data.message,
        created_at: formattedDate,
      };

      try {
        await pool.query("INSERT INTO users_messages SET ?", [completeMessage]);
        socket
          .to(userSockets.get(completeMessage.to_user_id))
          .emit("to_user_message_server", completeMessage);

        socket.emit("to_user_message_server", completeMessage);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      // console.log(`Usuario desconectado: ${socket.userID}`);
    });
  });
};

export default socketService;
