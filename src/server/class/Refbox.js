const Config = require("../../config/setup.json");
const { socket } = require("./WebSocket");

class Refbox {
  client;
  ip_refbox = Config.ip_refbox;
  port_refbox = Config.port_tcp_refbox;

  // output
  status = false;
  message = {};

  constructor() {
    const THAT = this;
    const NET = require("net");
    THAT.client = new NET.Socket();
  }

  connect() {
    const THAT = this;
    THAT.client.connect(THAT.port_refbox, THAT.ip_refbox, () => {
      THAT.status = true;
      console.log("refbox in connected");
    });
  }

  disconnect() {
    const THAT = this;
    THAT.status = false;
    THAT.client.destroy();
  }

  setMessage(message) {
    const THAT = this;
    THAT.message = JSON.parse(message.slice(0, -1));
    console.log(THAT.message);
  }
}

module.exports = new Refbox();
