import { io } from "socket.io-client";

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io(import.meta.env.VITE_ENV_SOCKET_ENDPOINT);
  }

  emitUIToServer(emitter, data) {
    const THAT = this;
    const EMITTER = emitter;
    const DATA = data;
    THAT.socket.emit(EMITTER, DATA);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();
