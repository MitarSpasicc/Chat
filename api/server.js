const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const errorHandler = require("./handlers/errorHandler");
let app = express();
const server = http.createServer(app);
dotenv.config();

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: "*",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "*",
  })
);
app.use(express.json());

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("MongoDB started running");
  }
);

app.use("/api/users", userRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./chat/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("./", "chat", "build", "index.html"));
  });
}

// SOCKET

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (users.length > 1 && user) {
      io.to(user.socketId).emit("getMessage", { senderId, text });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`)
);

// ROUTES
