import { io } from "socket.io-client";

class SocketioService {
  socket;
  message = [
    "ini pesan pertama",
    "ini message kedua",
    "ini pesan ketiga",
    "ini message keempat",
    "ini pesan kelima",
  ];
  index = 0;

  constructor() {}

  setupSocketConnection() {
    this.socket = io(import.meta.env.VITE_ENV_SOCKET_ENDPOINT);

    this.socket.emit("my message", "Hello there from Vue.");
  }

  setIndex(index) {
    this.index = index;
  }

  emitMessage() {
    this.socket.emit(
      "my message",
      `${new Date().getTime()} || ${this.message[this.index]}`
    );
    console.log(`send message: ${this.message[this.index]}`);
  }

  //   onMsg() {
  //     this.socket.on("sub message", (msg) => {
  //       console.log(msg);
  //     });
  //   }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();
