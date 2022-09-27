class Refbox {
  client = null;
  port_refbox = 28097;
  ip_refbox = "172.16.0.31";
  constructor() {
    const THAT = this;
    const NET = require("net");
    THAT.client = new NET.Socket();
  }
}

module.exports = new Refbox();
