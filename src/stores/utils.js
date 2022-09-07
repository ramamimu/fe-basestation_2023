export const GLOBAL_DATA_UI = {
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
  status_control_robot: [0, 0, 0, 0, 0],
};

export const GLOBAL_DATA_SERVER = {
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

export const BS2PC_DATA_ROBOT = {
  // tx global data process basestation class
  // tx from ui transfer from basestation to robot class state
  // tx mux global data process on basestation class

  ...GLOBAL_DATA_UI,
  ...GLOBAL_DATA_SERVER,

  // processing mux data in robot class, Robot.js
  // called on basestation.js
  data_n_robot_mux_1: 22856,
  data_n_robot_mux_2: 25342,
};

export const PC2BS_DATA_ROBOT = {
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

export const COMMAND_ROBOT = {
  K: {
    text: "kick off",
    scope: "home",
    init: "S",
  },
  F: {
    text: "free kick",
    scope: "home",
    init: "S",
  },
  G: {
    text: "goal kick",
    scope: "home",
    init: "S",
  },
  C: {
    text: "corner kick",
    scope: "home",
    init: "S",
  },
  P: {
    text: "penalty",
    scope: "home",
    init: "S",
  },
  T: {
    text: "throw In",
    scope: "home",
    init: "S",
  },
  S: {
    text: "stop",
    scope: "all",
    init: "s",
  },
  s: {
    text: "start",
    scope: "all",
    init: "S",
  },
  N: {
    text: "drop ball",
    scope: "all",
    init: "S",
  },
  L: {
    text: "park",
    scope: "all",
    init: "S",
  },
  "#": {
    text: "calibration",
    scope: "all",
    init: "S",
  },
  k: {
    text: "kick off",
    scope: "away",
    init: "S",
  },
  f: {
    text: "free kick",
    scope: "away",
    init: "S",
  },
  g: {
    text: "goal kick",
    scope: "away",
    init: "S",
  },
  c: {
    text: "corner kick",
    scope: "away",
    init: "S",
  },
  p: {
    text: "penalty",
    scope: "away",
    init: "S",
  },
  t: {
    text: "throw In",
    scope: "away",
    init: "S",
  },
};
