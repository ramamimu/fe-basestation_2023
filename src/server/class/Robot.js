const { PC2BS_DATA_ROBOT, BS2PC_DATA_ROBOT } = require("../utils/init_data");

class Robot {
  // global data
  is_active = false;
  n_robot_sendiri = 0;
  n_robot_teman = 1;
  role = 1;

  // tx
  // The data comefrom GLOBAL DATA in Basestation.js
  bs2pc_data = {
    ...BS2PC_DATA_ROBOT,
  };

  // rx
  pc2bs_data = {
    ...PC2BS_DATA_ROBOT,
  };

  constructor(n_robot, role) {
    const THAT = this;
    THAT.n_robot_sendiri = n_robot;
    THAT.role = role;
  }

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
}

module.exports = Robot;
