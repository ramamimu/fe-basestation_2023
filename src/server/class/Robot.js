const {
  PC2BS_DATA_ROBOT,
  SELF_ALONE_DATA_ROBOT,
} = require("../utils/init_data");

class Robot {
  // output
  // self alone data
  self_data = {
    ...SELF_ALONE_DATA_ROBOT,
  };
  // rx
  pc2bs_data = {
    ...PC2BS_DATA_ROBOT,
  };

  constructor(role, ip) {
    const THAT = this;
    THAT.self_data.role = role;
    THAT.self_data.ip = ip;
  }

  setisActive(is_active) {
    const THAT = this;
    THAT.self_data.is_active = is_active;
  }
  setNRobotTeman(n_robot_teman, is_robot_ready) {
    const THAT = this;
    THAT.self_data.n_robot_teman = is_robot_ready ? n_robot_teman : 0;
  }
  setRole(role) {
    const THAT = this;
    THAT.self_data.role = role;
  }
  setPc2bsData(pc2bs_data) {
    const THAT = this;
    THAT.pc2bs_data = { ...pc2bs_data };
  }
  resetData() {
    const THAT = this;
    THAT.pc2bs_data = {
      ...PC2BS_DATA_ROBOT,
    };
    this.self_data.n_robot_teman = 0;
  }
}

module.exports = Robot;
