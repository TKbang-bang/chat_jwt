import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import bcrypt from "bcrypt";

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

    socket.on("group_message", async (data) => {
      // console.log(data);

      const [user] = await pool.query(
        "SELECT user_name, user_profile FROM users WHERE user_id = ?",
        [userID]
      );

      console.log(user);

      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

      const completeMessage = {
        message_id: crypto.randomUUID(),
        from_user_id: userID,
        group_id: data.groupId,
        message_content: data.message,
        created_at: formattedDate,
        user_name: user[0].user_name,
        user_profile: user[0].user_profile,
      };

      try {
        await pool.query(
          "INSERT INTO group_messages (message_id, from_user_id, group_id, message_content, created_at) VALUES (?, ?, ?, ?, ?)",
          [
            completeMessage.message_id,
            completeMessage.from_user_id,
            completeMessage.group_id,
            completeMessage.message_content,
            completeMessage.created_at,
          ]
        );

        socket
          .to(`${data.groupId}`)
          .emit("to_group_message_server", completeMessage);

        socket.emit("to_group_message_server", completeMessage);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("join_group", async (data) => {
      // verifiying if the group name exists in the database
      const [group] = await pool.query(
        "SELECT * FROM group_chats WHERE group_name = ?",
        [data.groupName]
      );

      if (group.length === 0)
        return socket.emit("join_group_server", {
          ok: false,
          message: "Group not found",
        });

      // verifying the password
      if (group[0].group_password == "" || group[0].group_password == null) {
        socket.join(`${group[0].group_id}`);

        return socket.emit("join_group_server", {
          ok: true,
          group_id: group[0].group_id,
        });
      } else {
        const passwordMatch = await bcrypt.compare(
          data.groupPassword,
          group[0].group_password
        );
        if (!passwordMatch)
          return socket.emit("join_group_server", {
            ok: false,
            message: "Incorrect password",
          });

        socket.join(`${group[0].group_id}`);

        return socket.emit("join_group_server", {
          ok: true,
          group_id: group[0].group_id,
        });
      }
    });

    socket.on("leave_group", (id) => {
      socket.leave(`${id}`);
    });

    socket.on("disconnect", () => {
      // console.log(`Usuario desconectado: ${socket.userID}`);
    });
  });
};

export default socketService;
