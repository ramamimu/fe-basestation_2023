const Robot = require("./Robot.js");

class Basestation {
  // buffer variable
  buffer;

  // general variable
  host = "0.0.0.0";
  group = "224.16.32.80";
  udp_socket_rx;
  udp_socket_tx;
  // port_rx = "1026";
  port_rx = "5656";
  port_tx = "5666";
  web_socket;
  port_web_socket = "9999";
  pc2bs_data = {};

  // SEND TO UI
  robot = [
    new Robot(1, 2),
    new Robot(2, 3),
    new Robot(3, 4),
    new Robot(4, 5),
    new Robot(5, 6),
  ];

  // ROBOT DATA
  n_robot_to_array = {
    n_robot_1: 0,
    n_robot_2: 1,
    n_robot_3: 2,
    n_robot_4: 3,
    n_robot_5: 4,
  };

  // ---------- GLOBAL DATA ---------- //

  // PROCESS ON SERVER
  // SEND TO UI
  global_data = {
    bola_x_pada_lapangan: 112,
    bola_y_pada_lapangan: 225,
    // MUX GLOBAL
    n_robot_umpan: 2,
    n_robot_terima: 1,
    n_robot_aktif: 3,
    n_robot_dekat_bola: 1,
    n_robot_dapat_bola: 4,
    // ROLE
    n_attacker_left: 1,
    n_attacker_right: 2,
    n_defender_left: 3,
    n_defender_right: 4,
  };

  // INTERRUPT FROM UI
  global_data_from_ui = {
    header: 105,
    command: 83,
    style: 65,
    auto_kalibrasi: 0,
    n_robot_manual: 0,
    target_manual_x: 0,
    target_manual_y: 0,
    target_manual_theta: 0,
    odometry_offset_robot_x: 0,
    odometry_offset_robot_y: 0,
    odometry_offset_robot_theta: 0,
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

  emitter = {
    SERVER_TO_UI: "server2ui",
    UI_TO_SERVER: "ui2server",
  };

  constructor() {
    let THAT = this;
    // WEBSOCKET
    const express = require("express");
    const app = express();
    const http = require("http");
    const server = http.createServer(app);
    const { Server } = require("socket.io");
    THAT.web_socket = new Server(server, {
      cors: {
        origins: ["http://localhost:5173"],
      },
    });

    server.listen(THAT.port_web_socket, () => {
      console.log(`listening on port socket: ${THAT.port_web_socket}`);
    });

    // UDP
    THAT.udp_socket_rx = require("dgram").createSocket("udp4");
    THAT.udp_socket_tx = require("dgram").createSocket("udp4");
    THAT.buffer = require("buffer").Buffer;
  }

  // ---------- SETTER ---------- //

  setDataFromUI(item) {
    const THAT = this;
    THAT.global_data_from_ui = { ...item };
  }

  setBolaPadaLapangan() {}
  setNRobotUmpan() {}
  setNRobotTerima() {}
  setNRobotAktif() {}
  setNRobotDekatBola() {}
  setNRobotDapatBola() {}
  setRole() {}

  // write, read, and update data
  // this function should be on the bottom side of class
  // to make debugging easier

  // transfer data from global data to each robot
  updateDataRobot(index_robot) {
    const THAT = this;
    const GLOBAL_DATA = THAT.global_data;
    const GLOBAL_DATA_FROM_UI = THAT.global_data_from_ui;
    THAT.robot[index_robot].bs2pc_data = {
      ...THAT.robot[index_robot].bs2pc_data,
      ...GLOBAL_DATA_FROM_UI,
      ...GLOBAL_DATA,
    };
  }

  updateData() {
    const THAT = this;
    const EMITTER = THAT.emitter;
    const len_robot = THAT.robot.length;
    try {
      for (let i = 0; i < len_robot; i++) {
        const CURRENT_TIME = Number(new Date().getTime() / 1000);
        // if last epoch robot did not required, set is_active false
        // time in second
        const TIMEOUT = 2;
        if (CURRENT_TIME - Number(THAT.robot[i].pc2bs_data.epoch) > TIMEOUT) {
          THAT.robot[i].is_active = false;
        }
        THAT.updateDataRobot(i);
        THAT.robot[i].setMux1();
        THAT.robot[i].setMux2();
      }
    } catch (error) {
      console.log("update data error: ", error);
    }

    // SEND DATA TO UI
    const SERVER_TO_UI = {
      robot: [...THAT.robot],
    };

    THAT.web_socket.emit(EMITTER.SERVER_TO_UI, SERVER_TO_UI);
  }

  readPC2BSData(message) {
    const THAT = this;
    let counter = 0;
    try {
      const HEADER = [
        String.fromCharCode(message[0]),
        String.fromCharCode(message[1]),
        String.fromCharCode(message[2]),
      ];
      // console.log(HEADER);
      if (HEADER[0] == "i" && HEADER[1] == "t" && HEADER[2] == "s") {
        let identifier = String.fromCharCode(message[3]); // bs 0, r1 1 dst...
        counter = 4;
        if (identifier != 0 && identifier <= 5) {
          const ROBOT = THAT.robot[identifier - 1];
          const ROBOT_PC2BS = ROBOT.pc2bs_data;

          // if detect the id, set active
          ROBOT.is_active = true;

          // GET ALL MESSAGES
          ROBOT_PC2BS.epoch = message.readBigInt64LE(counter); // epoch sender n getter
          ROBOT_PC2BS.epoch = Math.floor(Number(ROBOT_PC2BS.epoch));
          counter += 8;
          ROBOT_PC2BS.pos_x = message.readInt16LE(counter); //pos x
          counter += 2;
          ROBOT_PC2BS.pos_y = message.readInt16LE(counter); //pos y
          counter += 2;
          ROBOT_PC2BS.theta = message.readInt16LE(counter); //theta
          counter += 2;
          ROBOT_PC2BS.status_bola = message.readUint8(counter); //status bola
          counter += 1;
          ROBOT_PC2BS.bola_x = message.readInt16LE(counter); //bola x pada lapangan
          counter += 2;
          ROBOT_PC2BS.bola_y = message.readInt16LE(counter); //bola y pada lapangan
          counter += 2;
          ROBOT_PC2BS.robot_condition = message.readInt16LE(counter); //robot condition
          counter += 2;
          ROBOT_PC2BS.target_umpan = message.readUint8(counter); //target umpan
          counter += 1;
          ROBOT_PC2BS.status_algoritma = message.readUint16LE(counter); //status algoritma
          counter += 2;
          ROBOT_PC2BS.status_sub_algoritma = message.readUint16LE(counter); //status sub algoritma
          counter += 2;
          ROBOT_PC2BS.status_sub_sub_algoritma = message.readUint16LE(counter); //status sub** algoritma
          counter += 2;
          ROBOT_PC2BS.status_sub_sub_sub_algoritma =
            message.readUint16LE(counter); //status sub*** algoritma
          counter += 2;
          console.log(ROBOT_PC2BS);
          // console.log(counter);
        }
      }
    } catch (e) {
      console.log("error read ", e);
    }
  }

  writeBS2PCData(index_robot) {
    const THAT = this;
    const BS2PC_DATA = THAT.robot[index_robot].bs2pc_data;
    let byte_counter = 0;
    let buffer_data = THAT.buffer.allocUnsafe(43);
    buffer_data.write("i", 0);
    buffer_data.write("t", 1);
    buffer_data.write("s", 2);
    buffer_data.write("0", 3);
    buffer_data.write(String.fromCharCode(BS2PC_DATA.header), 4);
    byte_counter = 5;
    byte_counter = buffer_data.writeInt8(BS2PC_DATA.command, byte_counter);
    byte_counter = buffer_data.writeInt8(BS2PC_DATA.style, byte_counter);
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.bola_x_pada_lapangan,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.bola_y_pada_lapangan,
      byte_counter
    );
    byte_counter = buffer_data.writeInt8(
      BS2PC_DATA.auto_kalibrasi,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.odometry_offset_robot_x,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.odometry_offset_robot_y,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.odometry_offset_robot_theta,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.target_manual_x,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.target_manual_y,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.target_manual_theta,
      byte_counter
    );
    byte_counter = buffer_data.writeUint16LE(
      BS2PC_DATA.data_n_robot_mux_1,
      byte_counter
    );
    byte_counter = buffer_data.writeUint16LE(
      BS2PC_DATA.data_n_robot_mux_2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_robot1,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_robot2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_robot3,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_robot4,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_robot5,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_sudut_robot1,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_sudut_robot2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_sudut_robot3,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_sudut_robot4,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_kecepatan_sudut_robot5,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_penendang_robot1,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_penendang_robot2,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_penendang_robot3,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_penendang_robot4,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC_DATA.trim_penendang_robot5,
      byte_counter
    );
    return { buffer_data, byte_counter };
  }
}

module.exports = new Basestation();
