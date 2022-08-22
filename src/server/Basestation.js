class Basestation {
  // buffer variable
  buffer;

  // general variable
  host = "0.0.0.0";
  group = "224.16.32.80";
  udp_socket;
  port_tx;
  port_rx = "1111";
  web_socket;
  port_web_socket = "3000";
  pc2bs_data = {};
  bs2pc_data = {};

  constructor() {
    // websocket
    const express = require("express");
    const app = express();
    const http = require("http");
    const server = http.createServer(app);
    const { Server } = require("socket.io");
    this.web_socket = new Server(server, {
      cors: {
        origins: ["http://localhost:5173"],
      },
    });

    server.listen(this.port_web_socket, () => {
      console.log(`listening on port socket: ${this.port_web_socket}`);
    });

    // udp
    this.udp_socket = require("dgram").createSocket("udp4");
    this.buffer = require("buffer").Buffer;
  }
  getPc2Bs() {
    let counter = 0;
    try {
      this.pc2bs_data.header = [
        String.fromCharCode(message[0]),
        String.fromCharCode(message[1]),
        String.fromCharCode(message[2]),
      ];
      counter = 3;
      this.pc2bs_data.pos_x = message.readInt16LE(3); //pos x
      counter += 2;
      this.pc2bs_data.pos_y = message.readInt16LE(5); //pos y
      counter += 2;
      this.pc2bs_data.theta = message.readInt16LE(7); //theta
      counter += 2;
      this.pc2bs_data.status_bola = message.readUint8(9); //bola x pada lapangan
      counter += 1;
      this.pc2bs_data.bola_x = message.readInt16LE(10); //bola y pada lapangan
      counter += 2;
      this.pc2bs_data.bola_y = message.readInt16LE(12); //bola y pada lapangan
      counter += 2;
      this.pc2bs_data.mcl_x = message.readInt16LE(14); //mcl x
      counter += 2;
      this.pc2bs_data.mcl_y = message.readInt16LE(16); //mcl y
      counter += 2;
      this.pc2bs_data.mcl_theta = message.readInt16LE(18); //mcl theta
      counter += 2;
      this.pc2bs_data.robot_condition = message.readInt16LE(20); //robot condition
      counter += 2;
      this.pc2bs_data.status_algoritma = message.readUint16LE(22); //status algoritma
      counter += 2;
      this.pc2bs_data.status_sub_algoritma = message.readUint16LE(24); //status sub algoritma
      counter += 2;
      this.pc2bs_data.status_sub_sub_algoritma = message.readUint16LE(26); //status sub sub algoritma
      counter += 2;
      this.pc2bs_data.status_sub_sub_sub_algoritma = message.readUint16LE(28); //status sub sub sub algoritma
      counter += 2;
      this.pc2bs_data.target_umpan = message.readUint8(30); //target umpan
      counter += 1;
      this.pc2bs_data.epoch = message.readUint32LE(31); //epoch
      counter += 4;
      this.pc2bs_data.stm_epoch = message.readUint32LE(35); //stm epoch
      counter += 4;
      // let counter = 39;
      this.pc2bs_data.obs = [];
      for (let i = 0; i < 144; i++) {
        this.pc2bs_data.obs[i] = message.readUint16LE(counter);
        counter += 2;
      }
      console.log(this.pc2bs_data);
      // io.emit("sub message", this.pc2bs_data);
    } catch (e) {
      console.log("error range");
    }
  }
  sayHello() {
    console.log("hello world");
  }
}

module.exports = new Basestation();
