const Robot = require("./Robot.js");
const {
  GLOBAL_DATA_SERVER,
  PC2BS_DATA_ROBOT,
  BS2PC_DATA_ROBOT,
} = require("../utils/init_data");

const Config = require("../../config/setup.json");

class Basestation {
  // buffer variable
  buffer;

  // general variable
  host = "0.0.0.0";
  group = Config.group_multicast;
  udp_socket_rx;
  udp_socket_tx;
  // port_rx = Config.port_udp_multicast;
  port_rx = "5656";
  port_tx = "5666";

  emitter = {
    SERVER_TO_UI: "server2ui",
    UI_TO_SERVER: "ui2server",
  };

  // WEB SOCKET
  web_socket = require("./WebSocket");

  // PC TO BS
  robot = [
    new Robot(2),
    new Robot(3),
    new Robot(4),
    new Robot(5),
    new Robot(6),
  ];

  // REFBOX
  refbox = require("./Refbox");

  // ---------- GLOBAL DATA ---------- //

  // output
  global_data_server = {
    ...GLOBAL_DATA_SERVER,
  };

  bs2pc_data = {
    ...BS2PC_DATA_ROBOT,
  };

  constructor() {
    const THAT = this;
    THAT.udp_socket_rx = require("dgram").createSocket("udp4");
    THAT.udp_socket_tx = require("dgram").createSocket("udp4");
    THAT.buffer = require("buffer").Buffer;
  }

  // ---------- GENERAL FUNCTION ---------- //

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

  setNRobotsFriend(index_robot) {
    const THAT = this;
    const ROBOT = THAT.robot[index_robot];
    if (THAT.global_data_server.n_robot_aktif <= 1) {
      ROBOT.setNRobotTeman(0);
    } else {
      ROBOT.setNRobotTeman(THAT.getNRobotCloser(index_robot));
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
      const ROBOT = THAT.robot[i];
      const SELF_ALONE_ROBOT_DATA = ROBOT.self_data;
      if (CURRENT_TIME - Number(ROBOT.pc2bs_data.epoch) > TIMEOUT) {
        ROBOT.setisActive(false);
      }

      if (SELF_ALONE_ROBOT_DATA.is_active) {
        THAT.setNRobotsFriend(i);
      }
    }

    let n_robot_aktif = 0;
    for (let i = 1; i < LEN_ROBOT; i++) {
      const ROBOT = THAT.robot[i];
      const SELF_ALONE_ROBOT_DATA = ROBOT.self_data;
      if (SELF_ALONE_ROBOT_DATA.is_active) {
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
    const UI_DATA = THAT.web_socket.data_ui;
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

  setRefboxStatus(status) {
    const THAT = this;
    const GLOBAL_DATA_UI = THAT.web_socket.data_ui;
    const REFBOX = THAT.refbox;
    if (status != GLOBAL_DATA_UI.connect_refbox) {
      if (status) {
        REFBOX.connect();
      } else {
        REFBOX.disconnect();
      }
      let msg_refbox = {
        status: REFBOX.status,
        message: {
          command: "STOP",
          targetTeam: "",
        },
      };
      THAT.web_socket.emitData("refbox", msg_refbox);
    }
  }

  setDataFromUI(item) {
    const THAT = this;
    const WEB_SOCKET = THAT.web_socket;
    THAT.setRefboxStatus(item.connect_refbox);
    WEB_SOCKET.setDataFromUI(item);
  }

  setRefboxData() {
    const THAT = this;
    const REFBOX = THAT.refbox;
    let msg_refbox = {
      status: REFBOX.status,
      message: REFBOX.message,
    };
    THAT.web_socket.emitData("refbox", msg_refbox);
  }

  setBS2PC() {
    const THAT = this;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;
    const GLOBAL_DATA_UI = THAT.web_socket.data_ui;
    const BS2PC = THAT.bs2pc_data;

    if (!GLOBAL_DATA_UI.header_manual && !GLOBAL_DATA_UI.auto_kalibrasi) {
      BS2PC.header_manual_and_calibration = 0;
    } else if (!GLOBAL_DATA_UI.header_manual && GLOBAL_DATA_UI.auto_kalibrasi) {
      BS2PC.header_manual_and_calibration = 1;
    } else if (GLOBAL_DATA_UI.header_manual && !GLOBAL_DATA_UI.auto_kalibrasi) {
      BS2PC.header_manual_and_calibration = 10;
    } else if (GLOBAL_DATA_UI.header_manual && GLOBAL_DATA_UI.auto_kalibrasi) {
      BS2PC.header_manual_and_calibration = 11;
    }

    BS2PC.command = GLOBAL_DATA_UI.command;
    BS2PC.style = GLOBAL_DATA_UI.style;
    BS2PC.bola_x_pada_lapangan = GLOBAL_DATA_SERVER.bola_x_pada_lapangan;
    BS2PC.bola_y_pada_lapangan = GLOBAL_DATA_SERVER.bola_y_pada_lapangan;
    BS2PC.target_manual_x = GLOBAL_DATA_UI.target_manual_x;
    BS2PC.target_manual_y = GLOBAL_DATA_UI.target_manual_y;
    BS2PC.target_manual_theta = GLOBAL_DATA_UI.target_manual_theta;
    BS2PC.odometry_offset_robot_x = GLOBAL_DATA_UI.odometry_offset_robot_x;
    BS2PC.odometry_offset_robot_y = GLOBAL_DATA_UI.odometry_offset_robot_y;
    BS2PC.odometry_offset_robot_theta =
      GLOBAL_DATA_UI.odometry_offset_robot_theta;
    BS2PC.mux1 = GLOBAL_DATA_SERVER.mux1;
    BS2PC.mux2 = GLOBAL_DATA_SERVER.mux2;
    BS2PC.mux_n_robot_closer = GLOBAL_DATA_SERVER.mux_n_robot_closer;
    BS2PC.mux_bs_control_robot = GLOBAL_DATA_SERVER.mux_bs_control_robot;
    BS2PC.trim_kecepatan_robot = GLOBAL_DATA_UI.trim_kecepatan_robot;
    BS2PC.trim_kecepatan_sudut_robot =
      GLOBAL_DATA_UI.trim_kecepatan_sudut_robot;
    BS2PC.trim_penendang_robot = GLOBAL_DATA_UI.trim_penendang_robot;
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
      // THAT.setMuxNRobotCloser();
      THAT.setMuxNRobotControlledBS();
      // THAT.setRefboxData();
      THAT.setBS2PC();
    } catch (error) {
      console.log("update data error: ", error);
    }

    // SEND DATA TO UI
    const SERVER_TO_UI = {
      robot: [...THAT.robot],
      global_data_server: { ...THAT.global_data_server },
    };
    THAT.web_socket.emitData(EMITTER.SERVER_TO_UI, SERVER_TO_UI);
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
          const ROBOT_PC2BS = { ...PC2BS_DATA_ROBOT };

          // if detect the id, set active

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

          const ROBOT = THAT.robot[identifier - 1];
          ROBOT.setisActive(true);
          ROBOT.setPc2bsData(ROBOT_PC2BS);
        }
      }
    } catch (e) {
      console.log("error read ", e);
    }
  }

  writeBS2PCData() {
    const THAT = this;
    const BS2PC = THAT.bs2pc_data;
    let byte_counter = 0;
    let buffer_data = THAT.buffer.allocUnsafe(44);
    buffer_data.write("i", 0);
    buffer_data.write("t", 1);
    buffer_data.write("s", 2);
    buffer_data.write("0", 3);
    byte_counter = 4;
    byte_counter = buffer_data.writeInt8(
      BS2PC.header_manual_and_calibration,
      byte_counter
    );
    byte_counter = buffer_data.writeInt8(BS2PC.command, byte_counter);
    byte_counter = buffer_data.writeInt8(BS2PC.style, byte_counter);
    byte_counter = buffer_data.writeInt16LE(
      BS2PC.bola_x_pada_lapangan,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC.bola_y_pada_lapangan,
      byte_counter
    );

    // target manual
    byte_counter = buffer_data.writeInt16LE(
      BS2PC.target_manual_x,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC.target_manual_y,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC.target_manual_theta,
      byte_counter
    );

    byte_counter = buffer_data.writeInt16LE(
      BS2PC.odometry_offset_robot_x,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC.odometry_offset_robot_y,
      byte_counter
    );
    byte_counter = buffer_data.writeInt16LE(
      BS2PC.odometry_offset_robot_theta,
      byte_counter
    );
    byte_counter = buffer_data.writeUint16LE(BS2PC.mux1, byte_counter);
    byte_counter = buffer_data.writeUint16LE(BS2PC.mux2, byte_counter);
    byte_counter = buffer_data.writeUint16LE(
      BS2PC.mux_bs_control_robot,
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_robot[0],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_robot[1],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_robot[2],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_robot[3],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_robot[4],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_sudut_robot[0],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_sudut_robot[1],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_sudut_robot[2],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_sudut_robot[3],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_kecepatan_sudut_robot[4],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_penendang_robot[0],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_penendang_robot[1],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_penendang_robot[2],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_penendang_robot[3],
      byte_counter
    );
    byte_counter = buffer_data.writeUInt8(
      BS2PC.trim_penendang_robot[4],
      byte_counter
    );
    return { buffer_data, byte_counter };
  }
}

module.exports = new Basestation();
