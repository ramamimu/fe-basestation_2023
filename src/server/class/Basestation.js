const Robot = require("./Robot.js");

class Basestation {
  // buffer variable
  buffer;

  // general variable
  host = "0.0.0.0";
  group = "224.16.32.80";
  udp_socket_rx;
  udp_socket_tx;
  port_rx = "1026";
  // port_rx = "5656";
  port_tx = "5666";
  web_socket;
  port_web_socket = "3002";
  pc2bs_data = {};

  // robot
  robot = [
    new Robot(1),
    new Robot(2),
    new Robot(3),
    new Robot(4),
    new Robot(5),
  ];

  // global_data
  header = 105;
  command = 83;
  style = 65;
  bola_x_pada_lapangan = 112;
  bola_y_pada_lapangan = 221;
  auto_kalibrasi = 0;
  n_attacker_left = 0;
  n_attacker_right = 0;
  n_defender_left = 0;
  n_defender_right = 0;
  n_robot_umpan = 0;
  n_robot_terima = 0;
  // mux global
  n_robot_aktif = 0;
  n_robot_dekat_bola = 0;
  n_robot_dapat_bola = 0;

  bs2pc_data = {
    header: 105,
    command: 83,
    style: 65,
    bola_x_pada_lapangan: 112,
    bola_y_pada_lapangan: 221,
    auto_kalibrasi: 0,
    odometry_offset_robot_x: 0,
    odometry_offset_robot_y: 0,
    odometry_offset_robot_theta: 0,
    target_manual_x: 0,
    target_manual_y: 0,
    target_manual_theta: 0,
    data_n_robot_mux_1: 22856,
    data_n_robot_mux_2: 25342,
    trim_kecepatan_robot1: 25,
    trim_kecepatan_robot2: 25,
    trim_kecepatan_robot3: 25,
    trim_kecepatan_robot4: 25,
    trim_kecepatan_robot5: 25,
    trim_kecepatan_sudut_robot1: 25,
    trim_kecepatan_sudut_robot2: 25,
    trim_kecepatan_sudut_robot3: 25,
    trim_kecepatan_sudut_robot4: 25,
    trim_kecepatan_sudut_robot5: 25,
    trim_penendang_robot1: 2,
    trim_penendang_robot2: 2,
    trim_penendang_robot3: 2,
    trim_penendang_robot4: 2,
    trim_penendang_robot5: 2,
  };

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
    this.udp_socket_rx = require("dgram").createSocket("udp4");
    this.udp_socket_tx = require("dgram").createSocket("udp4");
    this.buffer = require("buffer").Buffer;
  }

  sendDataToUI() {
    this.web_socket.emit("sub message", this.pc2bs_data);
  }

  setDataFromUI(msg_data) {
    // console.log(msg_data);
    // this.bs2pc_data = msg_data;
  }

  sayHello() {
    console.log("hello world");
  }

  // updated, write and read data
  // this function should be on the bottom side of class
  // to make debugging easier

  updateData() {
    const that = this;
    // is active
    const len_robot = that.robot.length;
    try {
      for (let i = 0; i < len_robot; i++) {
        const current_time = Number(new Date().getTime() / 1000);
        if (current_time - Number(that.robot[i].epoch) > 2) {
          that.robot[i].is_active = false;
        }
      }
    } catch (error) {
      console.log("update data error: ", error);
    }
  }

  readPC2BSData(message) {
    const that = this;
    let counter = 0;
    try {
      const header = [
        String.fromCharCode(message[0]),
        String.fromCharCode(message[1]),
        String.fromCharCode(message[2]),
      ];
      if (header[0] == "i" && header[1] == "t" && header[2] == "s") {
        // const identifier = message.readUint8(counter); // bs 0, r1 1 dst...
        counter = 3;
        let identifier = String.fromCharCode(message[3]); // bs 0, r1 1 dst...
        // parseInt(identifier);
        // identifier -= "0";
        // console.log("he tess ", identifier);
        counter += 1;
        if (identifier != 0 && identifier <= 5) {
          const d_robot = that.robot[identifier - 1];
          d_robot.is_active = true;

          // get all message
          d_robot.epoch = message.readBigInt64LE(counter); // epoch sender n getter
          counter += 8;
          d_robot.pos_x = message.readInt16LE(counter); //pos x
          counter += 2;
          d_robot.pos_y = message.readInt16LE(counter); //pos y
          counter += 2;
          d_robot.theta = message.readInt16LE(counter); //theta
          counter += 2;
          d_robot.status_bola = message.readUint8(counter); //status bola
          counter += 1;
          d_robot.bola_x = message.readInt16LE(counter); //bola x pada lapangan
          counter += 2;
          d_robot.bola_y = message.readInt16LE(counter); //bola y pada lapangan
          counter += 2;
          d_robot.robot_condition = message.readInt16LE(counter); //robot condition
          counter += 2;
          d_robot.target_umpan = message.readUint8(counter); //target umpan
          counter += 1;
          d_robot.status_algoritma = message.readUint16LE(counter); //status algoritma
          counter += 2;
          d_robot.status_sub_algoritma = message.readUint16LE(counter); //status sub algoritma
          counter += 2;
          d_robot.status_sub_sub_algoritma = message.readUint16LE(counter); //status sub** algoritma
          counter += 2;
          d_robot.status_sub_sub_sub_algoritma = message.readUint16LE(counter); //status sub*** algoritma
          counter += 2;
          // console.log(d_robot);
          // console.log(counter);
        }
      }
    } catch (e) {
      console.log("error read ", e);
    }
  }

  writeBS2PCData() {
    let that = this;
    let byte_counter = 0;
    let buffer_data = that.buffer.allocUnsafe(43);
    buffer_data.write("i", 0);
    buffer_data.write("t", 1);
    buffer_data.write("s", 2);
    buffer_data.write("0", 3);
    buffer_data.write(String.fromCharCode(that.bs2pc_data.header), 4);
    byte_counter = 5;
    byte_counter = buffer_data.writeInt8(that.bs2pc_data.command, byte_counter);
    byte_counter = buffer_data.writeInt8(that.bs2pc_data.style, byte_counter);
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.bola_x_pada_lapangan,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.bola_y_pada_lapangan,
      byte_counter
    );
    byte_counter = buffer_data.writeInt8(
      that.bs2pc_data.auto_kalibrasi,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.odometry_offset_robot_x,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.odometry_offset_robot_y,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.odometry_offset_robot_theta,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.target_manual_x,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.target_manual_y,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      that.bs2pc_data.target_manual_theta,
      byte_counter
    );
    byte_counter = buffer_data.writeUint16LE(
      that.bs2pc_data.data_n_robot_mux_1,
      byte_counter
    );
    byte_counter = buffer_data.writeUint16LE(
      that.bs2pc_data.data_n_robot_mux_2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_robot1,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_robot2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_robot3,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_robot4,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_robot5,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_sudut_robot1,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_sudut_robot2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_sudut_robot3,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_sudut_robot4,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_kecepatan_sudut_robot5,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_penendang_robot1,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_penendang_robot2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_penendang_robot3,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_penendang_robot4,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      that.bs2pc_data.trim_penendang_robot5,
      byte_counter
    );
    console.log("byte counter = ", byte_counter);
    return { buffer_data, byte_counter };
  }
}

module.exports = new Basestation();
