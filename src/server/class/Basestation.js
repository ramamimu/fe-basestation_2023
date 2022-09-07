const Robot = require("./Robot.js");
const { GLOBAL_DATA_SERVER, GLOBAL_DATA_UI } = require("../utils/init_data");

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

  // ---------- GLOBAL DATA ---------- //

  // PROCESS ON SERVER
  // SEND TO UI
  global_data = {
    ...GLOBAL_DATA_SERVER,
  };

  // INTERRUPT FROM UI
  global_data_from_ui = {
    ...GLOBAL_DATA_UI,
  };

  emitter = {
    SERVER_TO_UI: "server2ui",
    UI_TO_SERVER: "ui2server",
  };

  constructor() {
    const THAT = this;
    // WEBSOCKET
    const EXPRESS = require("express");
    const APP = EXPRESS();
    const HTTP = require("http");
    const SERVER = HTTP.createServer(APP);
    const { Server } = require("socket.io");
    THAT.web_socket = new Server(SERVER, {
      cors: {
        origins: ["http://localhost:5173"],
      },
    });

    SERVER.listen(THAT.port_web_socket, () => {
      console.log(`listening on port socket: ${THAT.port_web_socket}`);
    });

    // UDP
    THAT.udp_socket_rx = require("dgram").createSocket("udp4");
    THAT.udp_socket_tx = require("dgram").createSocket("udp4");
    THAT.buffer = require("buffer").Buffer;
  }

  // ---------- GENERAL FUNCTION ---------- //
  getStatusActiveRobot(index_robot) {
    if (
      this.robot[index_robot].is_active &&
      this.robot[index_robot].bs2pc_data.status_control_robot[index_robot]
    ) {
      return 1;
    }

    return 0;
  }

  pythagoras(x1, y1, x2, y2) {
    return Math.sqrt(
      Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)
    );
  }

  isBallCatched() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;

    for (let i = 1; i < LEN_ROBOT; i++) {
      if (THAT.robot[i].pc2bs_data.status_bola == 2) {
        return { status: true, index_robot: i };
      }
    }
    return { status: false, index_robot: 0 };
  }

  isBallAppear() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;

    // n_robot 1 include here bcs it's also determine global ball when others robot can't see
    for (let i = 0; i < LEN_ROBOT; i++) {
      if (THAT.robot[i].pc2bs_data.status_bola == 1) {
        return { status: true };
      }
    }
    return { status: false };
  }

  // ---------- GETTER ---------- //
  getNRobotClosestBall() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;
    let ball_distance = 9999;
    let n_robot_closest_ball = 0;

    for (let i = 1; i < LEN_ROBOT; i++) {
      if (
        THAT.robot[i].is_active &&
        THAT.robot[i].pc2bs_data.status_bola == 1 &&
        THAT.robot[i].pc2bs_data.status_bola != 0
      ) {
        const BALL_POSITION = {
          x: THAT.robot[i].pc2bs_data.bola_x,
          y: THAT.robot[i].pc2bs_data.bola_y,
        };

        const ROBOT_POSITION = {
          x: THAT.robot[i].pc2bs_data.pos_x,
          y: THAT.robot[i].pc2bs_data.pos_y,
        };

        const PYTHAGORAS = THAT.pythagoras(
          BALL_POSITION.x,
          BALL_POSITION.y,
          ROBOT_POSITION.x,
          ROBOT_POSITION.y
        );
        if (PYTHAGORAS < ball_distance) {
          ball_distance = PYTHAGORAS;
          n_robot_closest_ball = i + 1;
        }
      }
    }

    // n_robot 1 include here bcs it's also determine global ball when others robot can't see
    if (
      n_robot_closest_ball == 0 &&
      THAT.robot[0].pc2bs_data.status_bola == 1 &&
      THAT.robot[0].is_active
    ) {
      n_robot_closest_ball = 1;
    }
    return n_robot_closest_ball;
  }

  // ---------- SETTER ---------- //

  setDataFromUI(item) {
    const THAT = this;
    THAT.global_data_from_ui = { ...item };
  }

  setNRobotAktif() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;
    let n_robot_aktif = 0;

    for (let i = 1; i < LEN_ROBOT; i++) {
      if (THAT.robot[i].is_active) {
        n_robot_aktif++;
      }
    }

    THAT.global_data.n_robot_aktif = n_robot_aktif;
  }
  setBallInField() {
    const THAT = this;
    // return status and index robot
    const IS_BALL_CATCHED = THAT.isBallCatched();
    const BALL_CATCHED_STATUS = IS_BALL_CATCHED.status;
    const ROBOT_CATCHED_BALL_INDEX = IS_BALL_CATCHED.index_robot;
    // return status
    const IS_BALL_APPEAR = THAT.isBallAppear().status;
    if (BALL_CATCHED_STATUS) {
      // ball x and y general
      THAT.global_data.n_robot_dapat_bola = ROBOT_CATCHED_BALL_INDEX + 1;
      THAT.global_data.n_robot_dekat_bola = ROBOT_CATCHED_BALL_INDEX + 1;

      THAT.global_data.bola_x_pada_lapangan =
        THAT.robot[ROBOT_CATCHED_BALL_INDEX].pc2bs_data.bola_x;
      THAT.global_data.bola_y_pada_lapangan =
        THAT.robot[ROBOT_CATCHED_BALL_INDEX].pc2bs_data.bola_y;
    } else if (IS_BALL_APPEAR) {
      const N_ROBOT_CLOSEST_BALL = THAT.getNRobotClosestBall();
      THAT.global_data.n_robot_dapat_bola = N_ROBOT_CLOSEST_BALL;
      THAT.global_data.n_robot_dekat_bola = N_ROBOT_CLOSEST_BALL;

      THAT.global_data.bola_x_pada_lapangan =
        THAT.robot[N_ROBOT_CLOSEST_BALL].pc2bs_data.bola_x;
      THAT.global_data.bola_y_pada_lapangan =
        THAT.robot[N_ROBOT_CLOSEST_BALL].pc2bs_data.bola_y;
    } else {
      THAT.global_data.n_robot_dapat_bola = 0;
      THAT.global_data.n_robot_dekat_bola = 0;

      THAT.global_data.bola_x_pada_lapangan = 9999;
      THAT.global_data.bola_y_pada_lapangan = 9999;
    }
  }

  setNRobotUmpan() {}
  setNRobotTerima() {}
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

        THAT.setNRobotAktif();
        // set n_robot dapat_bola, n_robot_dekat_bola, bola_x_pada_lapangan, and bola_y_pada_lapangan
        THAT.setBallInField();
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
      BS2PC_DATA.target_manual_x, // tambahi identifier di satuan
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.target_manual_y, // tambahi identifier di satuan
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
