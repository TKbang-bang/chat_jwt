import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/router.js";
import http from "http";
import socketService from "./services/socket.service.js";

// create express app
const app = express();

// create http server
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());

// routes
app.use(router);

// socket
socketService(server);

// start express server
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
