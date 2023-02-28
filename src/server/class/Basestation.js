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
  udp_multicast;
  udp_unicast;
  port_unicast = Config.port_unicast;
  port_multicast = Config.port_udp_multicast;
  group = Config.group_multicast;

  emitter = {
    SERVER_TO_UI: "server2ui",
    UI_TO_SERVER: "ui2server",
    REFBOX: "refbox",
  };

  // WEB SOCKET
  web_socket = require("./WebSocket");

  robot = [
    new Robot(1, Config.ip_robot_1),
    new Robot(3, Config.ip_robot_2),
    new Robot(4, Config.ip_robot_3),
    new Robot(5, Config.ip_robot_4),
    new Robot(6, Config.ip_robot_5),
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

  // ---------- LOGIC ---------- //
  counter_pass = {
    prev_state: 0,
    t1: 0,
    t2: new Date().getTime(),
    threshold_time_umpan: 5000,
    threshold_time_lepas: 10000,
    sudah_umpan: false,
    pass_counter: 0,
  };

  // ---------- GROUP OBS ---------- //
  group_obs = {
    delta_distance_threshold: 100,
    distance: 0,
    prev_distance: 0,
    delta_distance: [],
    delta_distance_counter: 0,
    delta_distance_start: 0,
    delta_distance_stop: 0,
    status_obstacle_array: [],
    status_obstacle: false,
    prev_status_obstacle: false,
    obstacle_sudut_pool: [],
    obstacle_jarak_pool: [],
    obs_x: [],
    obs_y: [],
  };

  // ---------- CONSTRUCTOR ---------- //

  constructor() {
    const THAT = this;
    THAT.udp_multicast = require("dgram").createSocket("udp4");
    THAT.udp_unicast = require("dgram").createSocket("udp4");
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
      if (THAT.robot[i].pc2bs_data.status_bola == 1 && THAT.isRobotReady(i)) {
        return { status: true };
      }
    }
    return { status: false };
  }

  isCondition20Exist() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;

    for (let i = 0; i < LEN_ROBOT; i++) {
      if (THAT.robot[i].pc2bs_data.robot_condition == 20) {
        return true;
      }
    }
    return false;
  }

  isRobotReady(index_robot) {
    const THAT = this;
    if (
      THAT.robot[index_robot].self_data.is_active &&
      THAT.web_socket.data_ui.status_control_robot[index_robot]
    ) {
      return true;
    }
    return false;
  }

  // ---------- GETTER ---------- //
  getNRobotClosestBall() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;
    let ball_distance = 9999;
    let n_robot_closest_ball = 0;

    for (let i = 1; i < LEN_ROBOT; i++) {
      if (this.isRobotReady(i) && THAT.robot[i].pc2bs_data.status_bola == 1) {
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
      THAT.isRobotReady(0)
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
      if (i != index_robot && THAT.isRobotReady(i)) {
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

  setNrobotWithBallArr() {
    const THAT = this;
    const LEN_ROBOT = THAT.robot.length;
    let n_robot_with_ball_arr = [
      {
        n_robot: 1,
        distance: 9999,
      },
      {
        n_robot: 2,
        distance: 9999,
      },
      {
        n_robot: 3,
        distance: 9999,
      },
      {
        n_robot: 4,
        distance: 9999,
      },
      {
        n_robot: 5,
        distance: 9999,
      },
    ];

    if (THAT.global_data_server.n_robot_dekat_bola != 0) {
      if (THAT.global_data_server.n_robot_dekat_bola != 1) {
        n_robot_with_ball_arr[
          THAT.global_data_server.n_robot_dekat_bola - 1
        ].distance = 0;
      }
    }

    for (let i = 1; i < LEN_ROBOT; i++) {
      if (
        THAT.robot[i].pc2bs_data.status_bola != 2 &&
        THAT.isRobotReady(i) &&
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
        n_robot_with_ball_arr[i].distance = PYTHAGORAS;
      }
    }

    n_robot_with_ball_arr.sort(function (a, b) {
      return a.distance - b.distance;
    });

    for (let i = 0; i < LEN_ROBOT; i++) {
      if (n_robot_with_ball_arr[i].distance != 9999) {
        THAT.global_data_server.n_array_robot_dekat_bola[i] =
          n_robot_with_ball_arr[i].n_robot;
      } else {
        THAT.global_data_server.n_array_robot_dekat_bola[i] = 0;
      }
    }
  }
  // ---------- SETTER ---------- //

  getObsGroup() {
    const THAT = this;
    const ROBOT = THAT.robot;
    const LEN_ROBOT = ROBOT.length;
    let obs_angle_result = [];
    let obs_dist_result = [];
    let dist_max = 100;
    let angle_max = 2.5;
    let counter_offset = 2;

    for (let index_robot = 0; index_robot < LEN_ROBOT; index_robot++) {
      const PC2BS_DATA = ROBOT[index_robot].pc2bs_data;
      let obs_dist_dummy = [];
      let obs_angle_dummy = [];

      obs_dist_dummy = [...PC2BS_DATA.obs_dist];
      obs_angle_dummy = [...PC2BS_DATA.obs_sudut];

      // abs angle
      obs_angle_dummy.forEach((value) => {
        if (value < 0) {
          value = 360 + value;
        }
      });

      let arr_temp = [];
      let sort_arr = [];

      // sorted arr based on angle
      arr_temp = obs_angle_dummy.map((value, index) => ({
        value,
        index,
        obs_dist: obs_dist_dummy[index],
      }));
      sort_arr = arr_temp.sort((a, b) => a.value - b.value);

      // empty arr
      obs_dist_dummy = [];
      obs_angle_dummy = [];
      obs_angle_result = [];
      obs_dist_result = [];
      let obs_dist_temp = [];
      let obs_angle_temp = [];

      // return value
      obs_angle_dummy = sort_arr.map((item) => item.value);
      obs_dist_dummy = sort_arr.map((item) => item.obs_dist);

      let prev_dist = obs_dist_dummy[0];
      let prev_angle = obs_angle_dummy[0];

      let dist = [];
      let angle = [];

      let status = false;
      let prev_status = false;
      let obs_status = [];

      let start = 0;
      let stop = 0;
      let counter = 0;

      // diskontinu: arr[0] & arr[last]
      if (
        Math.abs(
          obs_angle_dummy[0] - obs_angle_dummy[obs_angle_dummy.length - 1]
        ) <= angle_max &&
        Math.abs(
          obs_dist_dummy[0] - obs_dist_dummy[obs_dist_dummy.length - 1]
        ) <= dist_max
      ) {
        let counter_up = 0;
        let counter_down = 0;
        let counter_mean = 0;
        let index = 0;
        let len_obs = obs_angle_dummy.length;

        // depan
        for (let i = 0; i < len_obs - 1; i++) {
          if (
            Math.abs(obs_angle_dummy[i] - obs_angle_dummy[i + 1]) > angle_max &&
            Math.abs(obs_dist_dummy[i] - obs_dist_dummy[i + 1]) > dist_max
          ) {
            counter_up++;
            break;
          }
          counter_up++;
        }

        // belakang
        if (counter_up < len_obs - 1) {
          for (let i = len_obs - 1; i >= 1; i--) {
            if (
              Math.abs(obs_angle_dummy[i] - obs_angle_dummy[i - 1]) >
                angle_max &&
              Math.abs(obs_dist_dummy[i] - obs_dist_dummy[i - 1]) > dist_max
            ) {
              counter_down++;
              break;
            }
            counter_down++;
          }
        }

        counter_mean = Math.ceil((counter_up + counter_down) / 2);

        if (counter_mean > counter_up) {
          index = len_obs - (counter_mean - counter_up);
        } else {
          index = counter_up - counter_mean;
        }

        obs_angle_result.push(obs_angle_dummy[index]);
        obs_dist_result.push(obs_dist_dummy[index] - 20);

        for (let i = 0; i <= counter_up - 1; i++) {
          obs_angle_dummy[i] = 9999;
          obs_dist_dummy[i] = 9999;
        }

        for (let i = len_obs - 1; i >= len_obs - counter_down; i--) {
          obs_angle_dummy[i] = 9999;
          obs_dist_dummy[i] = 9999;
        }
      }

      // angle & dist difference
      for (let i = 1; i < obs_angle_dummy.length; i++) {
        if (obs_angle_dummy[i] != 9999 && obs_dist_dummy[i] != 9999) {
          angle = obs_angle_dummy[i];
          dist = obs_dist_dummy[i];
          obs_angle_temp.push(Math.abs(angle - prev_angle));
          obs_dist_temp.push(Math.abs(dist - prev_dist));
          prev_angle = obs_angle_dummy[i];
          prev_dist = obs_dist_dummy[i];
        }
      }

      if (
        obs_angle_dummy[0] != 9999 &&
        obs_angle_dummy[obs_angle_dummy.length - 1] != 9999 &&
        obs_dist_dummy[0] != 9999 &&
        obs_dist_dummy[obs_dist_dummy.length - 1] != 9999
      ) {
        obs_angle_temp.push(
          Math.abs(
            obs_angle_dummy[0] - obs_angle_dummy[obs_angle_dummy.length - 1]
          )
        );
        obs_dist_temp.push(
          Math.abs(
            obs_dist_dummy[0] - obs_dist_dummy[obs_dist_dummy.length - 1]
          )
        );
      }

      // check distance between
      for (let i = 0; i < obs_angle_temp.length; i++) {
        prev_status = status;
        if (obs_angle_temp[i] <= angle_max && obs_dist_temp[i] <= dist_max) {
          obs_status.push(true);
          status = true;
        } else {
          obs_status.push(false);
          status = false;
        }

        if (!prev_status && status) {
          start = i;
        }
        if (prev_status && !status) {
          stop = i;
        }

        if (i == obs_angle_temp.length - 1) {
          let flag = true;
          obs_status.forEach((value) => {
            if (value == false) {
              flag = false;
            }
          });
          if (flag) {
            status = false;
            stop = i;
          }
        }

        if (prev_status && !status) {
          if (stop > start) {
            counter = stop - start;

            if (counter >= counter_offset) {
              let dist_mean = 0;
              let angle_mean = 0;
              for (let j = start; j <= stop; j++) {
                j =
                  j +
                  (j < 0) * obs_angle_dummy.length -
                  (j >= obs_angle_dummy.length) * obs_angle_dummy.length;
                dist_mean += obs_dist_dummy[j];
                angle_mean += obs_angle_dummy[j];
              }
              dist_mean /= counter + 1;
              angle_mean /= counter + 1;

              obs_dist_result.push(dist_mean + 10);
              obs_angle_result.push(angle_mean);
            }
          }
        }
      }

      let obs_x = [];
      let obs_y = [];
      for (let j = 0; j < obs_angle_result.length; j++) {
        let dist = obs_dist_result[j];
        let angle = obs_angle_result[j];
        let x = parseInt(
          (dist * Math.cos(((angle - 90) * Math.PI) / 180)).toFixed(2)
        );
        let y = parseInt(
          (dist * Math.sin(((angle - 90) * Math.PI) / 180)).toFixed(2)
        );
        obs_x.push(x);
        obs_y.push(y);
      }
      ROBOT[index_robot].self_data.group_obs_x = [...obs_x];
      ROBOT[index_robot].self_data.group_obs_y = [...obs_y];
    }
  }

  setNRobotsFriend(index_robot) {
    const THAT = this;
    const ROBOT = THAT.robot[index_robot];
    if (THAT.global_data_server.n_robot_aktif <= 1) {
      ROBOT.setNRobotTeman(0);
    } else {
      ROBOT.setNRobotTeman(
        THAT.getNRobotCloser(index_robot),
        THAT.isRobotReady(index_robot)
      );
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
      if (SELF_ALONE_ROBOT_DATA.is_active) {
        const minus = CURRENT_TIME - Number(ROBOT.self_data.bs_time_);
        if (minus > TIMEOUT) {
          ROBOT.resetData();
          ROBOT.setisActive(false);
        }

        if (SELF_ALONE_ROBOT_DATA.is_active) {
          THAT.setNRobotsFriend(i);
        }
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
      THAT.global_data_server.n_robot_dapat_bola = 0;
      THAT.global_data_server.n_robot_dekat_bola = N_ROBOT_CLOSEST_BALL;

      if (N_ROBOT_CLOSEST_BALL) {
        THAT.global_data_server.bola_x_pada_lapangan =
          THAT.robot[N_ROBOT_CLOSEST_BALL - 1].pc2bs_data.bola_x;
        THAT.global_data_server.bola_y_pada_lapangan =
          THAT.robot[N_ROBOT_CLOSEST_BALL - 1].pc2bs_data.bola_y;
      } else {
        THAT.global_data_server.bola_x_pada_lapangan = 0;
        THAT.global_data_server.bola_y_pada_lapangan = 0;
      }

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

    // get n_robot closer as array
    THAT.setNrobotWithBallArr();
  }

  setRole() {
    // 0 Goal Keeper
    // 1 attacker
    // 2 defender 1
    // 3 assist
    // 4 defender 2

    // this.robot[0].setRole(0);
    // this.robot[1].setRole(1);
    // this.robot[2].setRole(3);
    // this.robot[3].setRole(0);
    // this.robot[4].setRole(0);

    // === Dynamic Role ===
    const THAT = this;
    if (!THAT.isCondition20Exist()) {
      let N_ARR_DEKAT_BOLA = THAT.global_data_server.n_array_robot_dekat_bola;
      let LEN_N_ARR_DEKAT_BOLA = N_ARR_DEKAT_BOLA.length;
      let counter_role = 1;
      for (let i = 0; i < LEN_N_ARR_DEKAT_BOLA; i++) {
        const INDEX_ROBOT = N_ARR_DEKAT_BOLA[i] - 1;

        if (!THAT.isRobotReady(i)) {
          THAT.robot[i].setRole(0);
        }

        if (INDEX_ROBOT > 0 && THAT.isRobotReady(INDEX_ROBOT)) {
          switch (counter_role) {
            case 1:
              THAT.robot[INDEX_ROBOT].setRole(1);
              break;
            case 2:
              THAT.robot[INDEX_ROBOT].setRole(3);
              break;
            case 3:
              THAT.robot[INDEX_ROBOT].setRole(2);
              break;
            case 4:
              THAT.robot[INDEX_ROBOT].setRole(4);
              break;
          }
          counter_role++;
        }
        THAT.robot[0].setRole(0);
      }
    }
  }

  setMux1() {
    const THAT = this;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    const CONVERSION = 6;
    let mux = 0;
    mux += GLOBAL_DATA_SERVER.n_robot_aktif;
    mux += GLOBAL_DATA_SERVER.n_robot_dekat_bola * CONVERSION;
    mux += GLOBAL_DATA_SERVER.n_robot_dapat_bola * CONVERSION * CONVERSION;
    mux +=
      GLOBAL_DATA_SERVER.n_robot_umpan * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      GLOBAL_DATA_SERVER.n_robot_terima *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION;

    GLOBAL_DATA_SERVER.mux1 = mux;
  }

  setMux2() {
    const THAT = this;
    const ROBOT = THAT.robot;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    const CONVERSION = 6;
    let mux = 0;
    mux += ROBOT[0].self_data.role;
    mux += ROBOT[1].self_data.role * CONVERSION;
    mux += ROBOT[2].self_data.role * CONVERSION * CONVERSION;
    mux += ROBOT[3].self_data.role * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      ROBOT[4].self_data.role *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION;

    GLOBAL_DATA_SERVER.mux2 = mux;
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
    const GLOBAL_DATA_UI = THAT.web_socket.data_ui;
    const GLOBAL_DATA_SERVER = THAT.global_data_server;

    let mux = 0;
    mux |= GLOBAL_DATA_UI.status_control_robot[0] * 0b00001;
    mux |= GLOBAL_DATA_UI.status_control_robot[1] * 0b00010;
    mux |= GLOBAL_DATA_UI.status_control_robot[2] * 0b00100;
    mux |= GLOBAL_DATA_UI.status_control_robot[3] * 0b01000;
    mux |= GLOBAL_DATA_UI.status_control_robot[4] * 0b10000;

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
      THAT.web_socket.emitData(THAT.emitter.REFBOX, msg_refbox);
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
    let msg_refbox;
    if (Config.is_2019) {
      let { string_command, target_team } = THAT.setMessageRefbox(
        REFBOX.message
      );
      msg_refbox = {
        status: REFBOX.status,
        message: {
          command: string_command,
          targetTeam: target_team,
        },
      };
    } else {
      msg_refbox = {
        status: REFBOX.status,
        message: REFBOX.message,
      };
    }
    THAT.web_socket.emitData(THAT.emitter.REFBOX, msg_refbox);
  }

  setMessageRefbox(command) {
    let string_command;
    let target_team;
    let play = ["W", "s", "S", "N", "L", "#", "a"];

    if (play.includes(command)) {
      target_team = "ALL";
    } else if (command.toUpperCase() == command) {
      target_team = "HOME";
    } else {
      target_team = "AWAY";
    }

    if (command == "s") {
      string_command = "START";
    } else if (command == "S") {
      string_command = "STOP";
    } else if (command == "N") {
      string_command = "DROP_BALL";
    } else if (command == "L") {
      string_command = "PARK";
    } else if (command == "#") {
      string_command = "KALIBRASI";
    } else if (command == "a") {
      string_command = "GOAL";
    } else if (command == "W") {
      string_command = "WELCOME";
    } else {
      if (command == "K" || command == "k") {
        string_command = "KICKOFF";
      } else if (command == "F" || command == "f") {
        string_command = "FREEKICK";
      } else if (command == "G" || command == "g") {
        string_command = "GOALKICK";
      } else if (command == "T" || command == "t") {
        string_command = "THROWIN";
      } else if (command == "C" || command == "c") {
        string_command = "CORNER";
      } else if (command == "P" || command == "p") {
        string_command = "PENALTY";
      }
    }

    return { string_command, target_team };
  }

  setObs() {
    const ROBOT = this.robot;
    const len_robot = ROBOT.length;
    for (let i = 0; i < len_robot; i++) {
      const PC2BS_DATA = ROBOT[i].pc2bs_data;
      const LEN_OBS = PC2BS_DATA.obs_length;
      let obs_x = [];
      let obs_y = [];
      for (let j = 0; j < LEN_OBS; j++) {
        let dist = PC2BS_DATA.obs_dist[j];
        let angle = PC2BS_DATA.obs_sudut[j];
        let x = dist * Math.cos(((angle - 90) * Math.PI) / 180);
        let y = dist * Math.sin(((angle - 90) * Math.PI) / 180);
        obs_x.push(x);
        obs_y.push(y);
      }
      ROBOT[i].self_data.obs_x = obs_x;
      ROBOT[i].self_data.obs_y = obs_y;
    }
  }

  setCounterPass() {
    const COUNTER_PASS = this.counter_pass;
    const GLOBAL_DATA_SERVER = this.global_data_server;
    let state = this.global_data_server.n_robot_dapat_bola > 0;

    if (COUNTER_PASS.prev_state == 1 && state == 0) {
      COUNTER_PASS.t1 = new Date().getTime();
    } else if (COUNTER_PASS.prev_state == 0 && state == 1) {
      COUNTER_PASS.t2 = new Date().getTime();
    }

    let current_time = new Date().getTime();

    if (
      COUNTER_PASS.t2 - COUNTER_PASS.t1 < COUNTER_PASS.threshold_time_umpan &&
      COUNTER_PASS.prev_state == 0 &&
      state == 1
    ) {
      GLOBAL_DATA_SERVER.pass_counter++;
      COUNTER_PASS.sudah_umpan = true;
    } else if (
      current_time - COUNTER_PASS.t2 >
      COUNTER_PASS.threshold_time_lepas
    ) {
      GLOBAL_DATA_SERVER.pass_counter = 0;
      COUNTER_PASS.sudah_umpan = false;
    }

    GLOBAL_DATA_SERVER.pass_counter > 222
      ? 222
      : GLOBAL_DATA_SERVER.pass_counter;

    COUNTER_PASS.prev_state = state;
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
    BS2PC.pass_counter = GLOBAL_DATA_SERVER.pass_counter;
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

      // role
      THAT.setRole();

      // mux n aktif, n closest ball, n catch ball, n attacker left, n attacker right
      THAT.setMux1(); // shared data global
      THAT.setMux2(); // role
      THAT.setMuxNRobotCloser();
      THAT.setMuxNRobotControlledBS();
      THAT.setObs();
      THAT.getObsGroup();
      THAT.setCounterPass();

      // assign data to bs2pc data
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
    let n_robot = 0;
    try {
      const HEADER = [
        String.fromCharCode(message[0]),
        String.fromCharCode(message[1]),
        String.fromCharCode(message[2]),
      ];
      if (HEADER[0] == "i" && HEADER[1] == "t" && HEADER[2] == "s") {
        let identifier = String.fromCharCode(message[3]); // bs 0, r1 dst...
        counter = 4;
        if (identifier != 0 && identifier <= 5) {
          n_robot = identifier;
          // Assign data to robot depend on number identifier as array of robot
          const ROBOT_PC2BS = {
            ...THAT.robot[identifier - 1].pc2bs_data,
          };

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

          // read OBS
          ROBOT_PC2BS.index_point = message.readUint8(counter); // index point
          counter += 1;
          ROBOT_PC2BS.obs_length = message.readUint8(counter); // obs length
          counter += 1;

          ROBOT_PC2BS.obs_dist = [];
          ROBOT_PC2BS.obs_sudut = [];

          for (let i = 0; i < ROBOT_PC2BS.obs_length; i++) {
            ROBOT_PC2BS.obs_dist.push(message.readInt16LE(counter)); // distance
            counter += 2;
            ROBOT_PC2BS.obs_sudut.push(message.readUint8(counter) * 2.5); // sudut
            counter += 1;
          }

          ROBOT_PC2BS.battery_health = message.readFloatLE(counter);
          counter += 4;

          ROBOT_PC2BS.pos_x_odometry = message.readInt16LE(counter); //pos x
          counter += 2;
          ROBOT_PC2BS.pos_y_odometry = message.readInt16LE(counter); //pos y
          counter += 2;
          ROBOT_PC2BS.theta_odometry = message.readInt16LE(counter); //pos y
          counter += 2;

          ROBOT_PC2BS.vx_icp = message.readInt16LE(counter); //pos y
          counter += 2;
          ROBOT_PC2BS.vy_icp = message.readInt16LE(counter); //pos y
          counter += 2;

          const ROBOT = THAT.robot[identifier - 1];
          ROBOT.setisActive(true);
          ROBOT.setPc2bsData(ROBOT_PC2BS);
          ROBOT.self_data.bs_time_ = Number(new Date().getTime() / 1000);
        }
      }
    } catch (e) {
      console.log("error read ", e);
      console.log("in robot ", n_robot);
    }
  }

  writeBS2PCData() {
    const THAT = this;
    THAT.updateData();

    const BS2PC = THAT.bs2pc_data;

    let buffer_data;
    let byte_counter = 0;
    let total_byte = 45;
    if (Config.is_multicast) {
      buffer_data = THAT.buffer.allocUnsafe(total_byte);
    } else {
      const TOTAL_BYTE = total_byte + 9 * 5;
      buffer_data = THAT.buffer.allocUnsafe(TOTAL_BYTE);
    }

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
    byte_counter = buffer_data.writeUInt8(BS2PC.pass_counter, byte_counter);

    if (!Config.is_multicast) {
      const LEN_ROBOT = THAT.robot.length;

      // status active
      for (let i = 0; i < LEN_ROBOT; i++) {
        let status_active;
        THAT.isRobotReady(i) ? (status_active = 1) : (status_active = 0);
        byte_counter = buffer_data.writeUint8(status_active, byte_counter);
      }

      // pos x
      for (let i = 0; i < LEN_ROBOT; i++) {
        const ROBOT_DATA = THAT.robot[i].pc2bs_data;
        byte_counter = buffer_data.writeInt16LE(ROBOT_DATA.pos_x, byte_counter);
      }

      // pos y
      for (let i = 0; i < LEN_ROBOT; i++) {
        const ROBOT_DATA = THAT.robot[i].pc2bs_data;
        byte_counter = buffer_data.writeInt16LE(ROBOT_DATA.pos_y, byte_counter);
      }

      // theta
      for (let i = 0; i < LEN_ROBOT; i++) {
        const ROBOT_DATA = THAT.robot[i].pc2bs_data;
        byte_counter = buffer_data.writeInt16LE(ROBOT_DATA.theta, byte_counter);
      }

      // robot condition
      for (let i = 0; i < LEN_ROBOT; i++) {
        const ROBOT_DATA = THAT.robot[i].pc2bs_data;
        byte_counter = buffer_data.writeInt16LE(
          ROBOT_DATA.robot_condition,
          byte_counter
        );
      }
    }

    return { buffer_data, byte_counter };
  }
}

module.exports = new Basestation();
