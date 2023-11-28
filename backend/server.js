const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddlewares");
dotenv.config();

const app = express();
const Port = process.env.PORT || 3001;
const connectDB = require("./config/db");
app.use(require("morgan")("dev"))
app.use(express.json());
app.use(express.static(__dirname + "/uploads"));
connectDB();
app.get("/", (req, res) => {
  res.send("API are running");
});
app.use("/api/user", userRoutes); 
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const client_url = process.env.CLIENT_URL  || "http://localhost:3000";

const server = app.listen(Port, console.log("listening on port", Port));


const io = require("socket.io")(server, {
  pingTimeout: 10000,
  cors: {
    origin: client_url,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connection");
  });

  socket.on("join", (chat) => {
    socket.join(chat);
  });

  socket.on("typing", (chat) => socket.in(chat).emit("typing"));
  socket.on("stop typing", (chat) => socket.in(chat).emit("stop typing"));

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) return console.log("chat not exist");
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessage);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
