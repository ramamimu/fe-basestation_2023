const Config = require("../../config/setup.json");

const GLOBAL_DATA_SERVER = {
  bola_x_pada_lapangan: 112,
  bola_y_pada_lapangan: 225,
  // MUX GLOBAL
  n_robot_umpan: 2,
  n_robot_terima: 1,
  n_robot_aktif: 3,
  n_robot_dekat_bola: 1,
  n_robot_dapat_bola: 4,
  n_array_robot_dekat_bola: [0, 0, 0, 0, 0],
  // MUX
  mux1: 0,
  mux2: 0,
  mux_role: 0,
  mux_n_robot_closer: 0,
  mux_bs_control_robot: 0,
  pass_counter: 0,
};

const GLOBAL_DATA_UI = {
  header_manual: false,
  command: 83,
  style: 65,
  auto_kalibrasi: false,
  connect_refbox: false,
  n_robot_manual: 0,
  // n robot manual
  target_manual_x: 0, // add identifier in the last digit
  target_manual_y: 0, // add identifier in the last digit
  target_manual_theta: 0, // add identifier in the last digit
  // n robot offset
  odometry_offset_robot_x: 0, // add identifier in the last digit
  odometry_offset_robot_y: 0, // add identifier in the last digit
  odometry_offset_robot_theta: 0, // add identifier in the last digit
  trim_kecepatan_robot: [25, 25, 25, 25, 25],
  trim_kecepatan_sudut_robot: [25, 25, 25, 25, 25],
  trim_penendang_robot: [2, 2, 2, 2, 2],
  status_control_robot: [...Config.status_control],
};

const SELF_ALONE_DATA_ROBOT = {
  is_active: false,
  n_robot_teman: 0,
  role: 0,
  ip: "",
  bs_time_: 0,
  obs_x: [],
  obs_y: [],
  group_obs_x: [],
  group_obs_y: [],
};

const PC2BS_DATA_ROBOT = {
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
  obs_x: [9999, 9999, 9999, 9999, 9999],
  obs_y: [9999, 9999, 9999, 9999, 9999],
  obs_length: [],
  obs_dist: [],
  obs_sudut: [],
  index_point: 9999,
  battery_health: 9999,
  pos_x_odometry: 9999,
  pos_y_odometry: 9999,
  theta_odometry: 9999,
  vx_icp: 9999,
  vy_icp: 9999,
};

const BS2PC_DATA_ROBOT = {
  header_manual_and_calibration: 0, // header manual and auto calibration
  command: 83,
  style: 65,
  bola_x_pada_lapangan: 0,
  bola_y_pada_lapangan: 0,
  target_manual_x: 0,
  target_manual_y: 0,
  target_manual_theta: 0,
  odometry_offset_robot_x: 0,
  odometry_offset_robot_y: 0,
  odometry_offset_robot_theta: 0,
  mux1: 0,
  mux2: 0,
  mux_bs_control_robot: 0,
  trim_kecepatan_robot: [25, 25, 25, 25, 25],
  trim_kecepatan_sudut_robot: [10, 10, 10, 10, 10],
  trim_penendang_robot: [2, 2, 2, 2, 2],
  pass_counter: 0,
};

// BS TO PC IN MS
const TIMER_BS_TO_PC_MS = 25;

module.exports = {
  GLOBAL_DATA_SERVER,
  GLOBAL_DATA_UI,
  PC2BS_DATA_ROBOT,
  BS2PC_DATA_ROBOT,
  TIMER_BS_TO_PC_MS,
  SELF_ALONE_DATA_ROBOT,
};
