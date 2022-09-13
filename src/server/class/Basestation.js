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

  emitter = {
    SERVER_TO_UI: "server2ui",
    UI_TO_SERVER: "ui2server",
  };

  // SEND TO UI
  robot = [
    new Robot(2),
    new Robot(3),
    new Robot(4),
    new Robot(5),
    new Robot(6),
  ];

  // ---------- GLOBAL DATA ---------- //

  // PROCESS ON SERVER
  // SEND TO UI

  global_data_server = {
    ...GLOBAL_DATA_SERVER,
  };

  // INTERRUPT FROM UI
  global_data_from_ui = {
    ...GLOBAL_DATA_UI,
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
  // getStatusActiveRobot(index_robot) {
  //   if (
  //     this.robot[index_robot].is_active &&
  //     this.robot[index_robot].status_control_robot[index_robot]
  //   ) {
  //     return 1;
  //   }

  //   return 0;
  // }

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
        THAT.robot[i].self_data.is_active &&
        THAT.robot[i].pc2bs_data.status_bola == 1
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
      THAT.robot[0].self_data.is_active
    ) {
      n_robot_closest_ball = 1;
    }
    return n_robot_closest_ball;
  }

  getNRobotShootTarget() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;
    const ROBOT_DATA = THAT.robot;

    let n_robot_shoot_n_robot_target = 0;
    let n_robot_Shooter = 0;

    for (let i = 0; i < LEN_ROBOT; i++) {
      if (
        ROBOT_DATA[i].pc2bs_data.target_umpan > 0 &&
        ROBOT_DATA[i].pc2bs_data.target_umpan <= 5
      ) {
        n_robot_Shooter = i + 1;
        n_robot_shoot_n_robot_target = ROBOT_DATA[i].pc2bs_data.target_umpan;
      }
    }

    return { n_robot_shoot_n_robot_target, n_robot_Shooter };
  }

  getNRobotCloser(index_robot) {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;
    let n_robot_closer = 0;
    let distance_closer = 9999;

    for (let i = 0; i < LEN_ROBOT; i++) {
      if (i != index_robot && THAT.robot[i].self_data.is_active) {
        const PYTHAGORAS = THAT.pythagoras(
          THAT.robot[index_robot].pc2bs_data.pos_x,
          THAT.robot[index_robot].pc2bs_data.pos_y,
          THAT.robot[i].pc2bs_data.pos_x,
          THAT.robot[i].pc2bs_data.pos_y
        );
        if (PYTHAGORAS < distance_closer) {
          distance_closer = PYTHAGORAS;
          n_robot_closer = i + 1;
        }
      }
    }
    return n_robot_closer;
  }

  // ---------- SETTER ---------- //

  setDataFromUI(item) {
    const THAT = this;
    THAT.global_data_from_ui = { ...item };
    console.log(item);
  }

  setNRobotsFriend(index_robot) {
    const THAT = this;
    const ROBOT_DATA = THAT.robot[index_robot];
    if (THAT.global_data_server.n_robot_aktif <= 1) {
      ROBOT_DATA.self_data.n_robot_teman = 0;
    } else {
      ROBOT_DATA.self_data.n_robot_teman = THAT.getNRobotCloser(index_robot);
    }
  }

  setNRobotData() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;

    // if last epoch robot did not required, set is_active false
    // time in second
    const CURRENT_TIME = Number(new Date().getTime() / 1000);
    const TIMEOUT = 2;

    for (let i = 0; i < LEN_ROBOT; i++) {
      const SELF_ALONE_ROBOT_DATA = THAT.robot[i].self_data;
      if (CURRENT_TIME - Number(THAT.robot[i].pc2bs_data.epoch) > TIMEOUT) {
        SELF_ALONE_ROBOT_DATA.is_active = false;
      }

      if (SELF_ALONE_ROBOT_DATA.is_active) {
        THAT.setNRobotsFriend(i);
      }
    }

    let n_robot_aktif = 0;
    for (let i = 1; i < LEN_ROBOT; i++) {
      if (THAT.robot[i].self_data.is_active) {
        n_robot_aktif++;
      }
    }

    THAT.global_data_server.n_robot_aktif = n_robot_aktif;
  }

  setBallInField() {
    const THAT = this;

    // return status and index robot
    const IS_BALL_CATCHED = THAT.isBallCatched();
    const BALL_CATCHED_STATUS = IS_BALL_CATCHED.status;
    const ROBOT_CATCHED_BALL_INDEX = IS_BALL_CATCHED.index_robot;

    // get status
    const IS_BALL_APPEAR = THAT.isBallAppear().status;
    if (BALL_CATCHED_STATUS) {
      // ball x and y general
      THAT.global_data_server.n_robot_dapat_bola = ROBOT_CATCHED_BALL_INDEX + 1;
      THAT.global_data_server.n_robot_dekat_bola = ROBOT_CATCHED_BALL_INDEX + 1;

      THAT.global_data_server.bola_x_pada_lapangan =
        THAT.robot[ROBOT_CATCHED_BALL_INDEX].pc2bs_data.bola_x;
      THAT.global_data_server.bola_y_pada_lapangan =
        THAT.robot[ROBOT_CATCHED_BALL_INDEX].pc2bs_data.bola_y;

      const { n_robot_shoot_n_robot_target, n_robot_Shooter } =
        THAT.getNRobotShootTarget();

      THAT.global_data_server.n_robot_umpan = n_robot_Shooter;
      THAT.global_data_server.n_robot_terima = n_robot_shoot_n_robot_target;
    } else if (IS_BALL_APPEAR) {
      const N_ROBOT_CLOSEST_BALL = THAT.getNRobotClosestBall();
      console.log(N_ROBOT_CLOSEST_BALL);
      THAT.global_data_server.n_robot_dapat_bola = N_ROBOT_CLOSEST_BALL;
      THAT.global_data_server.n_robot_dekat_bola = N_ROBOT_CLOSEST_BALL;

      THAT.global_data_server.bola_x_pada_lapangan =
        THAT.robot[N_ROBOT_CLOSEST_BALL].pc2bs_data.bola_x;
      THAT.global_data_server.bola_y_pada_lapangan =
        THAT.robot[N_ROBOT_CLOSEST_BALL].pc2bs_data.bola_y;

      THAT.global_data_server.n_robot_umpan = 0;
      THAT.global_data_server.n_robot_terima = 0;
    } else {
      THAT.global_data_server.n_robot_dapat_bola = 0;
      THAT.global_data_server.n_robot_dekat_bola = 0;

      THAT.global_data_server.bola_x_pada_lapangan = 9999;
      THAT.global_data_server.bola_y_pada_lapangan = 9999;

      THAT.global_data_server.n_robot_umpan = 0;
      THAT.global_data_server.n_robot_terima = 0;
    }
  }

  setRole() {}

  setMux1() {
    const THAT = this;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    const CONVERSION = 6;
    let mux = 0;
    mux += GLOBAL_DATA_SERVER.n_robot_aktif;
    mux += GLOBAL_DATA_SERVER.n_robot_dekat_bola * CONVERSION;
    mux += GLOBAL_DATA_SERVER.n_robot_dapat_bola * CONVERSION * CONVERSION;
    mux +=
      GLOBAL_DATA_SERVER.n_attacker_left * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      GLOBAL_DATA_SERVER.n_attacker_right *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION;

    GLOBAL_DATA_SERVER.mux1 = mux;
  }

  setMux2() {
    const THAT = this;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    const CONVERSION = 6;
    let mux = 0;
    mux += GLOBAL_DATA_SERVER.n_defender_left;
    mux += GLOBAL_DATA_SERVER.n_defender_right * CONVERSION;
    mux += GLOBAL_DATA_SERVER.n_robot_umpan * CONVERSION * CONVERSION;
    mux +=
      GLOBAL_DATA_SERVER.n_robot_terima * CONVERSION * CONVERSION * CONVERSION;

    GLOBAL_DATA_SERVER.mux2 = mux;
  }

  setMuxRole() {
    const THAT = this;
    const ROBOT_DATA = THAT.robot;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    const CONVERSION = 10;
    let mux = 0;
    mux += ROBOT_DATA[0].self_data.role;
    mux += ROBOT_DATA[1].self_data.role * CONVERSION;
    mux += ROBOT_DATA[2].self_data.role * CONVERSION * CONVERSION;
    mux += ROBOT_DATA[3].self_data.role * CONVERSION * CONVERSION * CONVERSION;
    mux += ROBOT_DATA[4].self_data.role * CONVERSION * CONVERSION * CONVERSION;

    console.log(mux);

    GLOBAL_DATA_SERVER.mux_role = mux;
  }

  setMuxNRobotCloser() {
    const THAT = this;
    const ROBOT = THAT.robot;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    const CONVERSION = 10;
    let mux = 0;
    mux += ROBOT[0].self_data.n_robot_teman;
    mux += ROBOT[1].self_data.n_robot_teman * CONVERSION;
    mux += ROBOT[2].self_data.n_robot_teman * CONVERSION * CONVERSION;
    mux +=
      ROBOT[3].self_data.n_robot_teman * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      ROBOT[4].self_data.n_robot_teman * CONVERSION * CONVERSION * CONVERSION;

    GLOBAL_DATA_SERVER.mux_n_robot_closer = mux;
  }

  setMuxNRobotControlledBS() {
    const THAT = this;
    const UI_DATA = THAT.global_data_from_ui;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    const CONVERSION = 10;
    let mux = 0;
    mux += UI_DATA.status_control_robot[0];
    mux += UI_DATA.status_control_robot[1] * CONVERSION;
    mux += UI_DATA.status_control_robot[2] * CONVERSION * CONVERSION;
    mux +=
      UI_DATA.status_control_robot[3] * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      UI_DATA.status_control_robot[4] * CONVERSION * CONVERSION * CONVERSION;

    GLOBAL_DATA_SERVER.mux_bs_control_robot = mux;
  }

  // write, read, and update data
  // this function should be on the bottom side of class
  // to make debugging easier

  updateData() {
    const THAT = this;
    const EMITTER = THAT.emitter;
    try {
      // set n robot is_active, n robot active, set n robot closer
      THAT.setNRobotData();

      // set n_robot dapat_bola, n_robot_dekat_bola, bola_x_pada_lapangan, set n_robot_umpan-terima and bola_y_pada_lapangan
      THAT.setBallInField();

      // THAT.setRole()

      // mux n aktif, n closest ball, n catch ball, n attacker left, n attacker right
      THAT.setMux1();
      THAT.setMux2();
      THAT.setMuxRole();
      THAT.setMuxNRobotCloser();
      THAT.setMuxNRobotControlledBS();
    } catch (error) {
      console.log("update data error: ", error);
    }

    // SEND DATA TO UI
    const SERVER_TO_UI = {
      robot: [...THAT.robot],
      global_data_server: { ...THAT.global_data_server },
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
          // Assign data to robot depend on number identifier as array of robot
          const ROBOT = THAT.robot[identifier - 1];
          const ROBOT_PC2BS = ROBOT.pc2bs_data;

          // if detect the id, set active
          ROBOT.self_data.is_active = true;

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
      BS2PC_DATA.target_manual_x, // tambahi identifier di satuan
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.target_manual_y, // tambahi identifier di satuan
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC_DATA.target_manual_theta, // tambahi identifier di satuan
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
