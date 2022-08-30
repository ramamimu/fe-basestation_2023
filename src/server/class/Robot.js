class Robot {
  // global data
  is_active = false;

  // tx
  // bs2pc_data = {
  header = 105;
  command = 83;
  style = 65;
  bola_x_pada_lapangan = 9999;
  bola_y_pada_lapangan = 9999;
  auto_kalibrasi = 0;
  // tx local
  odometry_offset_robot_x = 0;
  odometry_offset_robot_y = 0;
  odometry_offset_robot_theta = 0;
  target_manual_x = 0;
  target_manual_y = 0;
  target_manual_theta = 0;
  data_n_robot_mux_1 = 22856;
  data_n_robot_mux_2 = 25342;
  trim_kecepatan_robot1 = 25;
  trim_kecepatan_robot2 = 25;
  trim_kecepatan_robot3 = 25;
  trim_kecepatan_robot4 = 25;
  trim_kecepatan_robot5 = 25;
  trim_kecepatan_sudut_robot1 = 25;
  trim_kecepatan_sudut_robot2 = 25;
  trim_kecepatan_sudut_robot3 = 25;
  trim_kecepatan_sudut_robot4 = 25;
  trim_kecepatan_sudut_robot5 = 25;
  trim_penendang_robot1 = 2;
  trim_penendang_robot2 = 2;
  trim_penendang_robot3 = 2;
  trim_penendang_robot4 = 2;
  trim_penendang_robot5 = 2;
  //   };

  // rx
  // pc2bs_data = {
  // header: ["", "", ""],
  // identifier: 0,
  // rx local
  epoch = 0;
  pos_x = 9999;
  pos_y = 9999;
  theta = 9999;
  status_bola = 0;
  bola_x = 9999;
  bola_y = 9999;
  robot_condition = 9999;
  target_umpan = 0;
  status_algoritma = 9999;
  status_sub_algoritma = 9999;
  status_sub_sub_algoritma = 9999;
  status_sub_sub_sub_algoritma = 9999;
  //   };

  // mux robot

  n_robot_aktif = 0;
  n_robot_dekat_bola = 0;
  n_robot_dapat_bola = 0;
  n_robot_sendiri = 0;
  n_robot_teman = 0;
  n_attacker_left = 0;
  role = 0;
  n_attacker_right = 0;
  n_defender_left = 0;
  n_defender_right = 0;
  n_robot_umpan = 0;
  n_robot_terima = 0;
  // mux 1
  // uint8 n_robot_aktif -- global
  // uint8 n_robot_dekat_bola -- global
  // uint8 n_robot_dapat_bola -- global
  // uint8 n_robot_sendiri
  // uint8 n_robot_teman || -- terdekat
  // uint8 n_attacker_left -- global

  // mux 2
  // int8 role
  // uint8 n_attacker_right -- global
  // uint8 n_defender_left -- global
  // uint8 n_defender_right -- global
  // uint8 n_robot_umpan -- global
  // uint8 n_robot_terima -- global

  constructor(n_robot) {
    this.n_robot_sendiri = n_robot;
  }
}

module.exports = Robot;
