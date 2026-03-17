import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 🧠 MongoDB connect
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

// 💬 Message Schema
const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

// 🔥 Socket Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message } = data;

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    io.to(receiverId).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

// 🟡 Get messages API
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

server.listen(5000, () => {
  console.log("Socket server running on 5000");
});