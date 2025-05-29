import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import bcrypt from "bcrypt";

const socketService = (server) => {
  // creating the socket
  const io = new Server(server, {
    cors: {
      origin: `${process.env.CLIENT_URL}`,
      credentials: true,
    },
  });

  // middleware
  io.use((socket, next) => {
    //
    const token = socket.handshake.auth?.token;

    // check if the token is not null/undefined
    if (!token) {
      return next(new Error("No token given"));
    }

    try {
      // verify the token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      // assign the user id to the socket
      socket.userID = decoded.userID;
      // call the next middleware
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  // creating a map to store the user sockets
  const userSockets = new Map();

  io.on("connection", (socket) => {
    // user id from jwt
    const userID = socket.userID;
    // add the user id to the map
    userSockets.set(userID, socket.id);
    // show the user id when a user connects
    console.log(`Usuario conectado: ${socket.userID}`);

    // message from the client to a user
    socket.on("to_user_message", async (data) => {
      // creating a date for the message
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

      // creating the message
      const completeMessage = {
        message_id: crypto.randomUUID(),
        from_user_id: userID,
        to_user_id: data.to_user_id,
        message_content: data.message,
        created_at: formattedDate,
      };

      try {
        // saving the message
        await pool.query("INSERT INTO users_messages SET ?", [completeMessage]);
        // sending the message to to_user_id
        socket
          .to(userSockets.get(completeMessage.to_user_id))
          .emit("to_user_message_server", completeMessage);

        // sending the message to from_user_id
        socket.emit("to_user_message_server", completeMessage);
      } catch (error) {
        console.log(error);
      }
    });

    // message from the client to a group
    socket.on("group_message", async (data) => {
      // getting the user
      const [user] = await pool.query(
        "SELECT user_name, user_profile FROM users WHERE user_id = ?",
        [userID]
      );

      // creating a date for the message
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

      // creating the message
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
        // saving the message
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

        // sending the message to the group
        socket
          .to(`${data.groupId}`)
          .emit("to_group_message_server", completeMessage);

        // sending the message to from_user_id
        socket.emit("to_group_message_server", completeMessage);
      } catch (error) {
        console.log(error);
      }
    });

    // joining a group
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
        // if the group does not require a password
        if (data.groupPassword != "")
          return socket.emit("join_group_server", {
            ok: false,
            message: "Group does not require a password",
          });

        // joining the group
        socket.join(`${group[0].group_id}`);

        // sending the group id
        return socket.emit("join_group_server", {
          ok: true,
          group_id: group[0].group_id,
        });
      } else {
        // if the group requires a password
        const passwordMatch = await bcrypt.compare(
          data.groupPassword,
          group[0].group_password
        );
        if (!passwordMatch)
          return socket.emit("join_group_server", {
            ok: false,
            message: "Incorrect password",
          });

        // joining the group
        socket.join(`${group[0].group_id}`);

        // sending the group id
        return socket.emit("join_group_server", {
          ok: true,
          group_id: group[0].group_id,
        });
      }
    });

    // leaving a group
    socket.on("leave_group", (id) => {
      socket.leave(`${id}`);
    });

    socket.on("disconnect", () => {
      // removing the user from the map
      userSockets.delete(userID);
    });
  });
};

export default socketService;
