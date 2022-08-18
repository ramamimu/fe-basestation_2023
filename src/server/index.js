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
const { toNumber } = require("@vue/shared");
let Buffer = require("buffer").Buffer;
const PORT_UDP = "1111";
const GROUP = "224.16.32.80";
const HOST = "0.0.0.0";
const mtcast = udp.createSocket("udp4");

mtcast.on("listening", function () {
  // var address = mtcast.address();
  // console.log(
  //   "UDP Client listening on " + address.address + ":" + address.port
  // );
  mtcast.setBroadcast(true);
  mtcast.setMulticastTTL(64);
  mtcast.addMembership(GROUP, HOST);
});

var news = [
  "Borussia Dortmund wins German championship",
  "Tornado warning for the Bay Area",
  "More rain for the weekend",
  "Android tablets take over the world",
  "iPad2 sold out",
  "Nation's rappers down to last two samples",
];

let temp = 0;

setInterval(() => {
  temp++;
}, 1000);

const pushData = () => {
  // let data = Buffer.allocUnsafe(12);
  // data.writeInt8(105, 0);
  // data.writeInt16LE(1231, 1);

  const buff = Buffer.allocUnsafe(4);
  let data = 6969 + temp > 9999 ? 1111 : 6969 + temp;
  buff.write(data.toString(), 0, 4, "utf8");

  return buff;
};

mtcast.bind(PORT_UDP, HOST, () => {
  // setInterval(() => {
  //   var message = Buffer(news[Math.floor(Math.random() * news.length)]);
  //   mtcast.send(
  //     pushData(),
  //     0,
  //     pushData().length,
  //     PORT_UDP,
  //     GROUP,
  //     function (err) {
  //       // mtcast.send(message, 0, message.length, PORT_UDP, GROUP, function (err) {
  //       if (err) console.log(err);
  //       // console.log(new Date().getTime() + "\nA: Message sent");
  //     }
  //   );
  // }, 100);
});

mtcast.on("message", function (message, remote) {
  console.log(
    new Date().getTime() +
      " \nB: From UDP group: " +
      remote.address +
      ":" +
      remote.port +
      " - " +
      message
  );
  let numb = parseInt(message);
  let data = numb + temp > 9999 ? numb : numb + temp;
  console.log(typeof data + " a data");
  console.log(data + " a data");
  console.log(temp + " a temp");
  io.emit("sub message", data.toString());
});

// ---- LOGIC SOCKET

const PORT_SOCKET = 3000;

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("my message", (msg) => {
    console.log(`${new Date().getTime()}\nC: message receive from UI\n${msg}`);
    mtcast.send(msg, 0, msg.length, PORT_UDP, GROUP, function (err) {
      if (err) console.log(err);
      console.log(
        "\n" + new Date().getTime() + "\nD: Message to UDP group sent"
      );
    });
  });
});

server.listen(PORT_SOCKET, () => {
  console.log(`listening on *:${PORT_SOCKET}`);
});
