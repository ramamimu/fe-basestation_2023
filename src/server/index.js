const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  origins: ["http://localhost:3003", "http://localhost:1234", "http://localhost:5173"],
});
const cors = require("cors");
const PORT = 3003;

app.use(cors);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
