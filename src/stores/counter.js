import { defineStore } from "pinia";

export const useCounterStore = defineStore({
  id: "counter",
  state: () => ({
    counter: 3,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});

export const useSubscribe = defineStore({
  checker: ["i", "t", "s"],
  pos_x: 9999,
  pos_y: 9999,
  theta: 9999,
  status_bola: 9999,
  bola_x_pada_lapangan: 9999,
  bola_y_pada_lapangan: 9999,
  target_umpan: 9999,
  robot_condition: 9999,
  status_algoritma: null,
  status_sub_algoritma: null,
  status_sub_sub_algoritma: null,
  status_sub_sub_sub_algoritma: null,
  // mcl
  mcl_x: 9999,
  mcl_y: 9999,
  mcl_theta: 9999,
  // epoch
  epoch: 0,
  stm_epoch: 0,
  // obstacle
  jarak_obstacle: [],
  // auto kalibrasi
  auto_kalibrasi: 0,
});

export const usePublish = defineStore({
  header: ["i", "t", "s", 105], // i=105, m=109
  command: 83, // S
  style: 65, // A modepermainan (v)
  cnn_status: 1, // 1
  n_robot_aktif: 7, // 7
  n_robot_dekat_bola: 0, // 2 nomorrbtygdekatbola (x)
  n_robot_dapat_bola: 0, // 2 nomorrbtygstatusbola=2 (v)
  bola_x_pada_lapangan: 0, // 40 bolaxygterdekat (v)
  bola_y_pada_lapangan: 0, // 150 bolayygterdekat (v)
  obs_0: 2,
  obs_1: 1,
  obs_2: 4,
  n_robot_sendiri: 0,
  n_robot_teman: 0,
  // msg tambahan
  n_robot_umpan: 0,
  n_robot_terima: 0,
  status_mcl: 0,
  // =======
  // ROBOT 1
  // =======
  odometry_robot1: {
    x: 0,
    y: 0,
    theta: 90,
  },
  odometry_offset_robot1: {
    x: 0,
    y: 0,
    theta: 0,
  },
  trim_kecepatan_robot1: 25,
  trim_penendang_robot1: 2,
  trim_kecepatan_sudut_robot1: 25,
  switch_robot1: 0,
  robot_condition1: 0,
  // =======
  // ROBOT 2
  // =======
  odometry_robot2: {
    x: 0,
    y: 0,
    theta: 90,
  },
  odometry_offset_robot2: {
    x: 0,
    y: 0,
    theta: 0,
  },
  trim_kecepatan_robot2: 25,
  trim_kecepatan_sudut_robot2: 25,
  trim_penendang_robot2: 2,
  switch_robot2: 1,
  robot_condition2: 0,
  // =======
  // ROBOT 3
  // =======
  odometry_robot3: {
    x: 0,
    y: 0,
    theta: 90,
  },
  odometry_offset_robot3: {
    x: 0,
    y: 0,
    theta: 0,
  },
  trim_kecepatan_robot3: 25,
  trim_kecepatan_sudut_robot3: 25,
  trim_penendang_robot3: 2,
  switch_robot3: 0, // gangerti, mek madakne qt
  robot_condition3: 0,
  // =======
  // ROBOT 4
  // =======
  odometry_robot4: {
    x: 0,
    y: 0,
    theta: 90,
  },
  odometry_offset_robot4: {
    x: 0,
    y: 0,
    theta: 0,
  },
  trim_kecepatan_robot4: 25,
  trim_kecepatan_sudut_robot4: 25,
  trim_penendang_robot4: 2,
  switch_robot4: 0, // gangerti, mek madakne qt
  robot_condition4: 0,
  // =======
  // ROBOT 5
  // =======
  odometry_robot5: {
    x: 0,
    y: 0,
    theta: 90,
  },
  odometry_offset_robot5: {
    x: 0,
    y: 0,
    theta: 0,
  },
  trim_kecepatan_robot5: 25,
  trim_kecepatan_sudut_robot5: 25,
  trim_penendang_robot5: 2,
  switch_robot5: 0,
  robot_condition5: 0,

  n_robot_manual: 0,
  target_manual: {
    x: 0,
    y: 0,
    theta: 0,
  },

  pos_x_target_umpan: 0,
  pos_y_target_umpan: 0,
  status_umpan: 0,
});
