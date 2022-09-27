class Refbox {
  client = null;
  port_refbox = 28097;
  ip_refbox = "172.16.0.31";
  message = {};
  constructor() {
    const THAT = this;
    const NET = require("net");
    THAT.client = new NET.Socket();
  }

  connect() {
    const THAT = this;
    THAT.client.connect(THAT.port_refbox, THAT.ip_refbox, () => {
      console.log("refbox connected");
    });
  }

  // disconnected() {
  //   const THAT = this;
  //   THAT.client.connect(THAT.port_refbox, THAT.ip_refbox, () => {
  //     console.log("refbox connected");
  //   });
  // }
}

module.exports = new Refbox();
