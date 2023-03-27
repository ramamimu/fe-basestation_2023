import Config from "@/config/setup.json";

export const GLOBAL_DATA_UI = {
  header_manual: false,
  auto_kalibrasi: false,
  command: 83,
  style: 65,
  connect_refbox: false,
  n_robot_manual: 0,
  // n robot manual
  target_manual_x: 0, // add identifier at the last digit
  target_manual_y: 0, // add identifier at the last digit
  target_manual_theta: 0, // add identifier at the last digit
  // n robot offset
  odometry_offset_robot_x: 0, // add identifier at the last digit
  odometry_offset_robot_y: 0, // add identifier at the last digit
  odometry_offset_robot_theta: 0, // add identifier at the last digit
  trim_kecepatan_robot: [25, 25, 25, 25, 25],
  trim_kecepatan_sudut_robot: [10, 10, 10, 10, 10],
  trim_penendang_robot: [2, 2, 2, 2, 2],
  status_control_robot: [...Config.status_control],
};

export const GLOBAL_DATA_SERVER = {
  bola_x_pada_lapangan: 0,
  bola_y_pada_lapangan: 0,
  // MUX GLOBAL
  n_robot_umpan: 0,
  n_robot_terima: 0,
  n_robot_aktif: 0,
  n_robot_ready: 0,
  n_robot_dekat_bola: 0,
  n_robot_dapat_bola: 0,
  // MUX
  mux1: 0,
  mux2: 0,
  mux_n_robot_closer: 0,
  mux_bs_control_robot: 0,
  // PASS COUNTER
  pass_counter: 0,
  // VORONOI
  voronoi_start_points_x: [],
  voronoi_start_points_y: [],
  voronoi_end_points_x: [],
  voronoi_end_points_y: [],
};

export const POINTER_COLLECTION = [
  {
    is_active: false,
    n_robot_teman: 0,
    role: 0,
    ip: "",
    bs_time_: 0,
    obs_x: [],
    obs_y: [],
    group_obs_x: [],
    group_obs_y: [],
  },
  {
    is_active: false,
    n_robot_teman: 0,
    role: 0,
    ip: "",
    bs_time_: 0,
    obs_x: [],
    obs_y: [],
    group_obs_x: [],
    group_obs_y: [],
  },
  {
    is_active: false,
    n_robot_teman: 0,
    role: 0,
    ip: "",
    bs_time_: 0,
    obs_x: [],
    obs_y: [],
    group_obs_x: [],
    group_obs_y: [],
  },
  {
    is_active: false,
    n_robot_teman: 0,
    role: 0,
    ip: "",
    bs_time_: 0,
    obs_x: [],
    obs_y: [],
    group_obs_x: [],
    group_obs_y: [],
  },
  {
    is_active: false,
    n_robot_teman: 0,
    role: 0,
    ip: "",
    bs_time_: 0,
    obs_x: [],
    obs_y: [],
    group_obs_x: [],
    group_obs_y: [],
  },
];

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
  goalkeeper_field_x: 9999,
  goalkeeper_field_y: 9999,
};

export const REFBOX = {
  status: false,
  message: {
    command: "",
    targetTeam: "",
  },
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
    init: "~",
  },
  s: {
    text: "start",
    scope: "all",
    init: "~",
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
  W: {
    text: "welcome",
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
