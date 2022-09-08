const {
  PC2BS_DATA_ROBOT,
  SELF_ALONE_DATA_ROBOT,
} = require("../utils/init_data");

class Robot {
  // self alone data
  self_data = {
    ...SELF_ALONE_DATA_ROBOT,
  };

  // rx
  pc2bs_data = {
    ...PC2BS_DATA_ROBOT,
  };

  constructor(role) {
    const THAT = this;
    THAT.self_data.role = role;
  }
}

module.exports = Robot;
