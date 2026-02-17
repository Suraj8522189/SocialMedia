import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// used to store online users
const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://new-chat-app-mern.netlify.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getReceverSocketId(userId) {
  if (!userId) return null;
  return userSocketMap[userId.toString()];
}

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("userId from socket query:", userId);

  if (userId) {
    userSocketMap[userId.toString()] = socket.id;
  }

  // send online users list to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId.toString()];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
