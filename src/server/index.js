const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origins: ["http://localhost:5173"],
  },
});

// ----- UDP SERVER MULTICAST
const udp = require("dgram");
let Buffer = require("buffer").Buffer;
const PORT_UDP = "1111";
const GROUP = "224.16.32.80";
const HOST = "0.0.0.0";
const mtcast = udp.createSocket("udp4");

var news = [
  "Borussia Dortmund wins German championship",
  "Tornado warning for the Bay Area",
  "More rain for the weekend",
  "Android tablets take over the world",
  "iPad2 sold out",
  "Nation's rappers down to last two samples",
];

mtcast.on("listening", function () {
  // var address = mtcast.address();
  // console.log(
  //   "UDP Client listening on " + address.address + ":" + address.port
  // );
  mtcast.setBroadcast(true);
  mtcast.setMulticastTTL(64);
  mtcast.addMembership(GROUP, HOST);
});

mtcast.bind(PORT_UDP, HOST, () => {
  setInterval(() => {
    var message = Buffer(news[Math.floor(Math.random() * news.length)]);
    // mtcast.send(pushData(), 0, pushData().length, PORT, GROUP, function (err) {
    mtcast.send(message, 0, message.length, PORT_UDP, GROUP, function (err) {
      if (err) console.log(err);
      console.log(new Date().getTime() + "\nA: Message sent");
    });
  }, 100);
});

mtcast.on("message", function (message, remote) {
  console.log(
    new Date().getTime() +
      " \nB: From: " +
      remote.address +
      ":" +
      remote.port +
      " - " +
      message
  );
  io.emit("sub message", message.toString(), 5, "sepuluh");
});

// ---- LOGIC SOCKET

const PORT_SOCKET = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("my message", (msg) => {
    console.log(
      `\n${new Date().getTime()}\nC: message receive from UI\n${msg}`
    );
    mtcast.send(msg, 0, msg.length, PORT_UDP, GROUP, function (err) {
      if (err) console.log(err);
      console.log("\n" + new Date().getTime() + "\nD: Message sent");
    });
  });
});

server.listen(PORT_SOCKET, () => {
  console.log(`listening on *:${PORT_SOCKET}`);
});
