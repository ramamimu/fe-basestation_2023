class Refbox {
  client;
  port_refbox = 28097;
  ip_refbox = "192.168.1.138";

  // output
  message = {
    command: "STOP",
    targetTeam: "",
  };

  constructor() {
    const THAT = this;
    const NET = require("net");
    THAT.client = new NET.Socket();
  }

  connect() {
    const THAT = this;
    THAT.client.connect(THAT.port_refbox, THAT.ip_refbox, () => {
      console.log("refbox in connected");
    });
  }

  disconnect() {
    const THAT = this;
    THAT.client.destroy();
  }

  setMessage(message) {
    const THAT = this;
    THAT.message = JSON.parse(message.slice(0, -1));
  }
}

module.exports = new Refbox();
