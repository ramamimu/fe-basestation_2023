const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket.on("sendUpdateUsers", function (data) {
    io.emit("usersUpdate", data);
  });
});
