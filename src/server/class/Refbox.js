const Config = require("../../config/setup.json");

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
    if (Config.is_2019) {
      THAT.message = message;
    } else {
      THAT.message = JSON.parse(message.slice(0, -1));
      if (THAT.message.targetTeam == Config.group_multicast) {
        THAT.message.targetTeam = "HOME";
      } else if (THAT.message.targetTeam != "") {
        THAT.message.targetTeam = "AWAY";
      } else {
        THAT.message.targetTeam = "ALL";
      }
    }
  }
}

module.exports = new Refbox();
