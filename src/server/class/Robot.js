class Robot {
  // global data
  is_active = false;
  n_robot_sendiri = 0;
  n_robot_teman = 1;
  role = 1;

  // tx
  // The data comefrom GLOBAL DATA in Basestation.js
  bs2pc_data = {
    // tx global
    // process on server
    bola_x_pada_lapangan: 9999,
    bola_y_pada_lapangan: 9999,
    // tx from ui
    header: 105,
    command: 83,
    style: 65,
    auto_kalibrasi: 0,
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
    // process in this class
    // called on server index.js -> basestation.js
    data_n_robot_mux_1: 22856,
    data_n_robot_mux_2: 25342,
    // tx mux data
    // process on server
    n_attacker_left: 0,
    n_attacker_right: 0,
    n_defender_left: 0,
    n_defender_right: 0,
    n_robot_umpan: 0,
    n_robot_terima: 0,
    // mux_global
    // process on server
    n_robot_aktif: 0,
    n_robot_dekat_bola: 0,
    n_robot_dapat_bola: 0,
  };

  // rx
  pc2bs_data = {
    epoch: 0,
    pos_x: 9999,
    pos_y: 9999,
    theta: 9999,
    status_bola: 0,
    bola_x: 9999,
    bola_y: 9999,
    robot_condition: 9999,
    target_umpan: 0,
    status_algoritma: 9999,
    status_sub_algoritma: 9999,
    status_sub_sub_algoritma: 9999,
    status_sub_sub_sub_algoritma: 9999,
  };

  setNRobotTeman() {}

  setMux1() {
    const THAT = this;
    const CONVERSION = 6;
    let mux = 0;

    mux += THAT.bs2pc_data.n_robot_aktif;
    mux += THAT.bs2pc_data.n_robot_dekat_bola * CONVERSION;
    mux += THAT.bs2pc_data.n_robot_dapat_bola * CONVERSION * CONVERSION;
    mux += THAT.n_robot_sendiri * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      THAT.n_robot_teman * CONVERSION * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      THAT.bs2pc_data.n_attacker_left *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION;

    THAT.bs2pc_data.data_n_robot_mux_1 = mux;
  }

  setMux2() {
    const THAT = this;
    const CONVERSION = 6;
    let mux = 0;

    mux += THAT.role;
    mux += THAT.bs2pc_data.n_attacker_right * CONVERSION;
    mux += THAT.bs2pc_data.n_defender_left * CONVERSION * CONVERSION;
    mux +=
      THAT.bs2pc_data.n_defender_right * CONVERSION * CONVERSION * CONVERSION;
    mux +=
      THAT.bs2pc_data.n_robot_umpan *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION;
    mux +=
      THAT.bs2pc_data.n_robot_terima *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION *
      CONVERSION;

    THAT.bs2pc_data.data_n_robot_mux_2 = mux;
  }

  constructor(n_robot, role) {
    const THAT = this;
    THAT.n_robot_sendiri = n_robot;
    THAT.role = role;
  }
}

module.exports = Robot;
