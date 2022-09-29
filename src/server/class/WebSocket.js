const { GLOBAL_DATA_UI } = require("../utils/init_data");
const Config = require("../../config/setup.json");

class WebSocket {
  socket;
  port = Config.port_web_socket;

  // output
  data_ui = {
    ...GLOBAL_DATA_UI,
  };

  constructor() {
    const THAT = this;
    const EXPRESS = require("express");
    const APP = EXPRESS();
    const HTTP = require("http");
    const SERVER = HTTP.createServer(APP);
    const { Server } = require("socket.io");
    THAT.socket = new Server(SERVER, {
      cors: {
        origins: ["http://localhost:5173"],
      },
    });
    SERVER.listen(THAT.port, () => {
      console.log(`listening on port socket: ${THAT.port}`);
    });
  }

  emitData(emitter, data) {
    const THAT = this;
    THAT.socket.emit(emitter, data);
  }

  setDataFromUI(item) {
    const THAT = this;
    THAT.data_ui = { ...item };
  }
}

module.exports = new WebSocket();
