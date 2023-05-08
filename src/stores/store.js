import { io } from "socket.io-client";
import { defineStore } from "pinia";
import {
  PC2BS_DATA_ROBOT,
  POINTER_COLLECTION,
  GLOBAL_DATA_SERVER,
  GLOBAL_DATA_UI,
  COMMAND_ROBOT,
  REFBOX,
  AUTO_CMD,
} from "./utils";
import { useRos } from "./ros";
import Config from "../config/setup.json";
import { useToast } from "./toast";
import "roslib/build/roslib";

import r1_img from "../assets/Model_IRIS_Basestaton/Green Model/green.png";
import r2_img from "../assets/Model_IRIS_Basestaton/Blue Model/blue.png";
import r3_img from "../assets/Model_IRIS_Basestaton/Pink Model/pink.png";
import r4_img from "../assets/Model_IRIS_Basestaton/Red Model/red.png";
import r5_img from "../assets/Model_IRIS_Basestaton/Yellow Model/yellow.png";
import r_offset from "../assets/robot_offset.png";
import r_goalkeeper from "../assets/Model_IRIS_Basestaton/Red Model/red.png";

import r1_with_ball_img from "../assets/Model_IRIS_Basestaton/Green Model/green_ball.png";
import r2_with_ball_img from "../assets/Model_IRIS_Basestaton/Blue Model/blue_ball.png";
import r3_with_ball_img from "../assets/Model_IRIS_Basestaton/Pink Model/pink_ball.png";
import r4_with_ball_img from "../assets/Model_IRIS_Basestaton/Red Model/red_ball.png";
import r5_with_ball_img from "../assets/Model_IRIS_Basestaton/Yellow Model/yellow_ball.png";

import r1_ball_img from "../assets/Model_IRIS_Basestaton/Green Model/bola_hijau.png";
import r2_ball_img from "../assets/Model_IRIS_Basestaton/Blue Model/bola_biru.png";
import r3_ball_img from "../assets/Model_IRIS_Basestaton/Pink Model/bola_pink.png";
import r4_ball_img from "../assets/Model_IRIS_Basestaton/Red Model/bola_merah.png";
import r5_ball_img from "../assets/Model_IRIS_Basestaton/Yellow Model/bola_kuning.png";

import ball_global_img from "../assets/Model_IRIS_Basestaton/Yellow Model/bola_kuning.png";

export const useLogicUI = defineStore({
  id: "logic-ui",
  state: () => ({
    toggle_menu: false,
    rotate_field: Config.rotate_field,
    override_mode: Config.override_mode,
    mode_cyan: Config.is_mode_cyan,
    current_field: "",
    status_offset: false,
    status_manual: false,
    n_robot_manual: 0,
    n_robot_offset: 0,
    command: {
      character: "S",
      text: "stop",
      scope: "all",
    },
    capslock: false,
    ip_refbox: Config.ip_refbox,
    ip_settings: false,
    is_multicast: Config.is_multicast,
    is_show_before_linked: false,
    is_share_to_ui: true,
    is_obs: true,
  }),
  actions: {
    toggleMenu() {
      this.toggle_menu = !this.toggle_menu;
    },
  },
});

export const useField = defineStore({
  id: "field",
  state: () => ({
    mouse_pointer_x: 0,
    mouse_pointer_y: 0,
    padding_tunning_x: 0,
    padding_tunning_y: 0,
    stage_config: {
      x: 700,
      y: 510,
      width: 1400,
      height: 1020,
      scale: {
        x: 1,
        y: 1,
      },
      offset: {
        x: 700,
        y: 510,
      },
      rotation: 0,
    },
    field_config: {
      x: 0,
      y: 0,
      image: new Image(),
      width: null,
      height: null,
      rotation: 0,
      offset: {
        x: 0,
        y: 0,
      },
    },
    ball_global_config: {
      x: 0,
      y: 0,
      image: new Image(),
      width: 50,
      height: 50,
      rotation: 0,
      opacity: 0.4,
      offset: {
        x: 25,
        y: 25,
      },
    },
    robot_offset: {
      x: 9999,
      y: 9999,
      image: new Image(),
      width: 100,
      height: 100,
      rotation: 90,
      opacity: 0.7,
      offset: {
        x: 50,
        y: 50,
      },
    },
    robot_goalkeeper: {
      x: 9999,
      y: 9999,
      image: new Image(),
      width: 100,
      height: 100,
      rotation: 180,
      opacity: 0.7,
      offset: {
        x: 50,
        y: 50,
      },
    },
    line_point: {
      x: 0,
      y: 0,
      points: [0, 0],
      tension: 0.8,
      strokeWidth: 12,
      closed: false,
      stroke: "red",
    },
    line_offset: {
      x: 0,
      y: 0,
      points: [0, 0],
      tension: 0.8,
      strokeWidth: 4,
      closed: false,
      stroke: "red",
    },
    robot_icp_config: [
      // array 0, robot 1
      {
        x: 100,
        y: 100,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        opacity: 0.4,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 1, robot 2
      {
        x: 150,
        y: 150,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        opacity: 0.4,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 2, robot 3
      {
        x: 200,
        y: 200,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        opacity: 0.4,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 3, robot 4
      {
        x: 250,
        y: 250,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        opacity: 0.4,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 4, robot 5
      {
        x: 300,
        y: 300,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        opacity: 0.4,
        offset: {
          x: 50,
          y: 50,
        },
      },
    ],
    robot_config: [
      // array 0, robot 1
      {
        x: 100,
        y: 100,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 1, robot 2
      {
        x: 150,
        y: 150,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 2, robot 3
      {
        x: 200,
        y: 200,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 3, robot 4
      {
        x: 250,
        y: 250,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        offset: {
          x: 50,
          y: 50,
        },
      },
      // array 4, robot 5
      {
        x: 300,
        y: 300,
        image: new Image(),
        width: 100,
        height: 100,
        rotation: 90,
        offset: {
          x: 50,
          y: 50,
        },
      },
    ],
    ball_config: [
      {
        x: 9999,
        y: 9999,
        image: new Image(),
        width: 30,
        height: 30,
        rotation: 0,
        offset: {
          x: 15,
          y: 15,
        },
      },
      {
        x: 9999,
        y: 9999,
        image: new Image(),
        width: 30,
        height: 30,
        rotation: 0,
        offset: {
          x: 15,
          y: 15,
        },
      },
      {
        x: 9999,
        y: 9999,
        image: new Image(),
        width: 30,
        height: 30,
        rotation: 0,
        offset: {
          x: 15,
          y: 15,
        },
      },
      {
        x: 9999,
        y: 9999,
        image: new Image(),
        width: 30,
        height: 30,
        rotation: 0,
        offset: {
          x: 15,
          y: 15,
        },
      },
      {
        x: 9999,
        y: 9999,
        image: new Image(),
        width: 30,
        height: 30,
        rotation: 0,
        offset: {
          x: 15,
          y: 15,
        },
      },
    ],
    line_config: [
      {
        x: 0,
        y: 0,
        points: [0, 0],
        tension: 0.8,
        strokeWidth: 4,
        closed: false,
        stroke: "black",
      },
      {
        x: 0,
        y: 0,
        points: [0, 0],
        tension: 0.8,
        strokeWidth: 4,
        closed: false,
        stroke: "black",
      },
      {
        x: 0,
        y: 0,
        points: [0, 0],
        tension: 0.8,
        strokeWidth: 4,
        closed: false,
        stroke: "black",
      },
      {
        x: 0,
        y: 0,
        points: [0, 0],
        tension: 0.8,
        strokeWidth: 4,
        closed: false,
        stroke: "black",
      },
      {
        x: 0,
        y: 0,
        points: [0, 0],
        tension: 0.8,
        strokeWidth: 4,
        closed: false,
        stroke: "black",
      },
    ],
    obs_config: [
      {
        x: 970,
        y: 300,
        width: 52,
        height: 52,
        fill: "black",
        offset: { x: 15, y: 15 },
      }, // 0
      {
        x: 616,
        y: 210,
        width: 52,
        height: 52,
        fill: "black",
        offset: { x: 15, y: 15 },
      }, // 1
      {
        x: 716,
        y: 210,
        width: 52,
        height: 52,
        fill: "black",
        offset: { x: 15, y: 15 },
      }, // 5
    ],
    robot_image: [r1_img, r2_img, r3_img, r4_img, r5_img],
    r_goalkeeper,
    r_offset,
    robot_with_ball_image: [
      r1_with_ball_img,
      r2_with_ball_img,
      r3_with_ball_img,
      r4_with_ball_img,
      r5_with_ball_img,
    ],
    ball_image: [
      r1_ball_img,
      r2_ball_img,
      r3_ball_img,
      r4_ball_img,
      r5_ball_img,
    ],
    ball_global_img,
  }),
  actions: {},
});

export const useRobot = defineStore({
  id: "robot",
  state: () => ({
    robot: [
      {
        self_data: POINTER_COLLECTION[0],
        pc2bs_data: PC2BS_DATA_ROBOT,
        ip: Config.ip_robot_1,
      },
      {
        self_data: POINTER_COLLECTION[1],
        pc2bs_data: PC2BS_DATA_ROBOT,
        ip: Config.ip_robot_2,
      },
      {
        self_data: POINTER_COLLECTION[2],
        pc2bs_data: PC2BS_DATA_ROBOT,
        ip: Config.ip_robot_3,
      },
      {
        self_data: POINTER_COLLECTION[3],
        pc2bs_data: PC2BS_DATA_ROBOT,
        ip: Config.ip_robot_4,
      },
      {
        self_data: POINTER_COLLECTION[4],
        pc2bs_data: PC2BS_DATA_ROBOT,
        ip: Config.ip_robot_5,
      },
    ],
    global_data_server: {
      ...GLOBAL_DATA_SERVER,
    },
    ui_to_server: {
      ...GLOBAL_DATA_UI,
    },
    command_translattor: {
      ...COMMAND_ROBOT,
    },
    refbox: {
      ...REFBOX,
    },
    auto_cmd: {
      ...AUTO_CMD,
    },
    obs_num: {
      obs_kiper: 2,
      obs_robot: [2, 7],
    },
    obs_point_keeper: [
      // { y: 900, x: 240 },
      // { y: 900, x: 300 },
      // { y: 900, x: 360 },
      { y: 0, x: 240 },
      { y: 0, x: 300 },
      { y: 0, x: 360 },
    ],
    obs_point: [
      // { y: 550, x: 150 },
      // { y: 650, x: 150 },
      // { y: 750, x: 150 },
      // { y: 550, x: 450 },
      // { y: 650, x: 450 },
      // { y: 750, x: 450 },
      // { y: 650, x: 300 },
      // { y: 750, x: 300 },
      { y: 350, x: 450 },
      { y: 250, x: 450 },
      { y: 150, x: 450 },
      { y: 350, x: 150 },
      { y: 250, x: 150 },
      { y: 150, x: 150 },
      { y: 250, x: 300 },
      { y: 150, x: 300 },
    ],
  }),
  actions: {
    setCommand(command) {
      const THAT = this;

      // set command in UI
      const LOGIC_UI_STATE = useLogicUI();
      LOGIC_UI_STATE.command.scope = THAT.command_translattor[command].scope;
      LOGIC_UI_STATE.command.text = THAT.command_translattor[command].text;
      // set command init in UI
      LOGIC_UI_STATE.command.character = THAT.command_translattor[command].init;

      // set command init in server
      THAT.ui_to_server.command =
        THAT.command_translattor[command].init.charCodeAt(0);

      setTimeout(() => {
        // set command in UI
        LOGIC_UI_STATE.command.character = command;

        // set command in server
        THAT.ui_to_server.command = command.charCodeAt(0);
      }, 150);
    },
    randomObs() {
      let possible_obs_kiper = [1, 2, 3];
      let possible_obs_1 = [1, 2, 3, 4, 5, 6];
      let possible_obs_2 = [7, 8];

      let random = setInterval(() => {
        let random_kiper = Math.floor(
          Math.random() * possible_obs_kiper.length
        );
        let random_1 = Math.floor(Math.random() * possible_obs_1.length);
        let random_2 = Math.floor(Math.random() * possible_obs_2.length);

        this.obs_num.obs_kiper = possible_obs_kiper[random_kiper];
        this.obs_num.obs_robot[0] = possible_obs_1[random_1];
        this.obs_num.obs_robot[1] = possible_obs_2[random_2];
      }, 100);

      setTimeout(() => {
        clearInterval(random);
      }, 1000);
    },
    offsetRobot(n_robot) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const FIELD_STATE = useField();
      const ROTATE_FIELD = LOGIC_UI_STATE.rotate_field;
      LOGIC_UI_STATE.status_offset = true;
      LOGIC_UI_STATE.n_robot_offset = n_robot;

      if (ROTATE_FIELD) {
        FIELD_STATE.robot_offset.x = THAT.posXWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.y = THAT.posYWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      } else {
        FIELD_STATE.robot_offset.x = THAT.posXNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.y = THAT.posYNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      }
      FIELD_STATE.mouse_pointer_x = THAT.robot[n_robot - 1].pc2bs_data.pos_x;
      FIELD_STATE.mouse_pointer_y = THAT.robot[n_robot - 1].pc2bs_data.pos_y;
    },
    robotManual(n_robot) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const FIELD_STATE = useField();
      const ROTATE_FIELD = LOGIC_UI_STATE.rotate_field;
      if (!LOGIC_UI_STATE.status_manual) {
        LOGIC_UI_STATE.status_manual = true;
        THAT.ui_to_server.header_manual = true;
        THAT.ui_to_server;
      }
      LOGIC_UI_STATE.n_robot_manual = n_robot;
      if (ROTATE_FIELD) {
        FIELD_STATE.robot_offset.x = THAT.posXWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.y = THAT.posYWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      } else {
        FIELD_STATE.robot_offset.x = THAT.posXNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.y = THAT.posYNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      }
      THAT.ui_to_server.target_manual_x = 0;
      THAT.ui_to_server.target_manual_y = 0;
      THAT.ui_to_server.target_manual_theta = 0;
    },
    autoKalibrasi() {
      if (this.ui_to_server.auto_kalibrasi) {
        this.ui_to_server.auto_kalibrasi = false;
      } else {
        this.ui_to_server.auto_kalibrasi = true;
      }
    },
    openControlBox(robot_order) {
      switch (robot_order) {
        case 0:
          window.open(`http://${Config.ip_robot_1}:9999/master/`);
          break;
        case 1:
          window.open(`http://${Config.ip_robot_2}:9999/master/`);
          break;
        case 2:
          window.open(`http://${Config.ip_robot_3}:9999/master/`);
          break;
        case 3:
          window.open(`http://${Config.ip_robot_4}:9999/master/`);
          break;
        case 4:
          window.open(`http://${Config.ip_robot_5}:9999/master/`);
          break;
      }
    },
    linkRobot(n_robot) {
      const THAT = this;
      const TOAST = useToast();
      const LOGIC_UI_STATE = useLogicUI();

      if (LOGIC_UI_STATE.is_share_to_ui) {
        if (THAT.ui_to_server.status_control_robot[n_robot - 1] === 1) {
          THAT.ui_to_server.status_control_robot[n_robot - 1] = 0;
        } else {
          THAT.ui_to_server.status_control_robot[n_robot - 1] = 1;
        }
      } else {
        TOAST.showToast("SHARE UI IS NOT ACTIVE", false, 3000);
      }
    },
    decreaseTheta() {
      const FIELD_STATE = useField();
      FIELD_STATE.robot_offset.rotation -= 2;
    },
    increaseTheta() {
      const FIELD_STATE = useField();
      FIELD_STATE.robot_offset.rotation += 2;
    },
    significantDecreaseTheta() {
      const FIELD_STATE = useField();
      FIELD_STATE.robot_offset.rotation -= 15;
    },
    significantIncreaseTheta() {
      const FIELD_STATE = useField();
      FIELD_STATE.robot_offset.rotation += 15;
    },
    confirmOffset() {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const FIELD_STATE = useField();
      let n_robot = LOGIC_UI_STATE.n_robot_offset;
      if (LOGIC_UI_STATE.status_offset) {
        THAT.ui_to_server.odometry_offset_robot_x = parseInt(
          FIELD_STATE.mouse_pointer_x.toString() + n_robot.toString()
        );
        THAT.ui_to_server.odometry_offset_robot_y = parseInt(
          FIELD_STATE.mouse_pointer_y.toString() + n_robot.toString()
        );
        THAT.ui_to_server.odometry_offset_robot_theta = parseInt(
          THAT.thetaOffset().toString() + n_robot.toString()
        );
        setTimeout(() => {
          LOGIC_UI_STATE.status_offset = false;
          LOGIC_UI_STATE.n_robot_offset = 0;
          THAT.ui_to_server.odometry_offset_robot_x = 0;
          THAT.ui_to_server.odometry_offset_robot_y = 0;
          THAT.ui_to_server.odometry_offset_robot_theta = 0;
          FIELD_STATE.mouse_pointer_x = 0;
          FIELD_STATE.mouse_pointer_y = 0;
        }, 150);
      }
    },
    returnTheta(theta) {
      if (theta < 0) {
        theta = 360 + (theta % 360);
      } else if (theta > 360) {
        theta = theta % 360;
      }

      if (theta > 180) {
        theta = (360 - theta) * -1;
      }

      return theta * -1;
    },
    posXNoRotate(pos_x) {
      const FIELD_STATE = useField();
      return pos_x + FIELD_STATE.padding_tunning_x;
    },
    posYNoRotate(pos_y) {
      const FIELD_STATE = useField();
      return pos_y + FIELD_STATE.padding_tunning_y;
    },
    thetaNoRotate(theta) {
      return theta * -1;
    },
    posXWithRotate(pos_x) {
      const FIELD_STATE = useField();
      return (
        FIELD_STATE.stage_config.width - pos_x - FIELD_STATE.padding_tunning_x
      );
    },
    posYWithRotate(pos_y) {
      const FIELD_STATE = useField();
      return (
        FIELD_STATE.stage_config.height - pos_y - FIELD_STATE.padding_tunning_y
      );
    },
    thetaWithRotate(theta) {
      return theta * -1 + 180;
    },
    thetaOffset() {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const FIELD_STATE = useField();
      let theta = LOGIC_UI_STATE.rotate_field
        ? THAT.reflectMatrixTheta(
            THAT.returnTheta(FIELD_STATE.robot_offset.rotation)
          )
        : THAT.returnTheta(FIELD_STATE.robot_offset.rotation);
      return theta;
    },
    posXObs(pos_x_obs) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      return LOGIC_UI_STATE.rotate_field
        ? THAT.posXWithRotate(pos_x_obs)
        : THAT.posXNoRotate(pos_x_obs);
    },
    posYObs(pos_y_obs) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      return LOGIC_UI_STATE.rotate_field
        ? THAT.posYWithRotate(pos_y_obs)
        : THAT.posYNoRotate(pos_y_obs);
    },
    changeStyle(number) {
      this.ui_to_server.style = number;
    },
    nextStyle() {
      let next = null;

      if (this.ui_to_server.style == 65) {
        // next = "B";
        next = 66;
      } else if (this.ui_to_server.style == 66) {
        // next = "C";
        next = 67;
      } else if (this.ui_to_server.style == 67) {
        // next = "A";
        next = 68;
      } else if (this.ui_to_server.style == 68) {
        next = 65;
      }

      this.setCommand("S");

      setTimeout(() => {
        this.updateStyle(next);
        this.setCommand("K");
      }, 150);
    },
    updateStyle(style) {
      this.ui_to_server.style = style;
    },
    reCurrent() {
      this.setCommand("S");
      setTimeout(() => {
        this.setCommand("K");
      }, 150);
    },
    reflectMatrixX(pos_x) {
      const FIELD_STATE = useField();
      return (
        FIELD_STATE.stage_config.height -
        pos_x -
        2 * FIELD_STATE.padding_tunning_y
      );
    },
    reflectMatrixY(pos_y) {
      const FIELD_STATE = useField();

      return (
        FIELD_STATE.stage_config.width -
        pos_y -
        2 * FIELD_STATE.padding_tunning_x
      );
    },
    reflectMatrixTheta(pos_theta) {
      let theta = 180 - Math.abs(pos_theta);
      theta = pos_theta < 0 ? theta : theta * -1;
      return theta;
    },
    getPointX(pos_x) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      let x = LOGIC_UI_STATE.rotate_field
        ? THAT.posXWithRotate(pos_x)
        : THAT.posXNoRotate(pos_x);
      return x;
    },
    getPointY(pos_y) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      let y = LOGIC_UI_STATE.rotate_field
        ? THAT.posYWithRotate(pos_y)
        : THAT.posYNoRotate(pos_y);
      return y;
    },
    getXBallGlobal() {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const GLOBAL_DATA_SERVER = THAT.global_data_server;
      let x = LOGIC_UI_STATE.rotate_field
        ? THAT.posXWithRotate(GLOBAL_DATA_SERVER.bola_y_pada_lapangan)
        : THAT.posXNoRotate(GLOBAL_DATA_SERVER.bola_y_pada_lapangan);
      return x;
    },
    getYBallGlobal() {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const GLOBAL_DATA_SERVER = THAT.global_data_server;
      let y = LOGIC_UI_STATE.rotate_field
        ? THAT.posYWithRotate(GLOBAL_DATA_SERVER.bola_x_pada_lapangan)
        : THAT.posYNoRotate(GLOBAL_DATA_SERVER.bola_x_pada_lapangan);
      return y;
    },
    setAutoCmd(index_robot) {
      const THAT = this;
      if (THAT.robot[index_robot].self_data.is_active) {
        THAT.auto_cmd.name = "stop";
        THAT.auto_cmd.ip = THAT.robot[index_robot].self_data.ip;
      } else if (!THAT.robot[index_robot].self_data.is_active) {
        THAT.auto_cmd.name = "run";
        THAT.auto_cmd.ip = THAT.robot[index_robot].self_data.ip;
      }
      THAT.sendAutoCmd();
    },
    setAutoCmdInverse(index_robot) {
      const THAT = this;
      if (!THAT.robot[index_robot].self_data.is_active) {
        THAT.auto_cmd.name = "stop";
        THAT.auto_cmd.ip = THAT.robot[index_robot].self_data.ip;
      } else if (THAT.robot[index_robot].self_data.is_active) {
        THAT.auto_cmd.name = "run";
        THAT.auto_cmd.ip = THAT.robot[index_robot].self_data.ip;
      }
      THAT.sendAutoCmd();
    },
    setAutoStop(index_robot) {
      const THAT = this;
      THAT.auto_cmd.name = "stop";
      THAT.auto_cmd.ip = THAT.robot[index_robot].self_data.ip;
      THAT.sendAutoCmd();
    },
    sendAutoCmd() {
      const THAT = this;
      const ROS_STATE = useRos();
      const LOGIC_UI_STATE = useLogicUI();
      const SOCKETIO_STATE = useSocketIO();
      const EMITTER = SOCKETIO_STATE.emitter;

      if (Config.is_ros) {
        const msg = new ROSLIB.Message(THAT.auto_cmd);
        ROS_STATE.auto_cmd.publish(msg);
      } else if (!Config.is_ros) {
        if (LOGIC_UI_STATE.is_share_to_ui) {
          SOCKETIO_STATE.emitUIToServer(EMITTER.AUTO_CMD, THAT.auto_cmd);
        }
      }
    },
    setStyleCommand(style) {
      const THAT = this;
      THAT.changeStyle(style);

      THAT.setCommand("S");
      setTimeout(() => {
        THAT.updateStyle(style);
        THAT.setCommand("K");
      }, 150);
    },
    keyboardListener(event) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const TIMER = useRegionalTimer();

      if (THAT.router.currentRoute._value.path != "/regional") {
        switch (event.key) {
          case "a":
            THAT.setCommand("#");
            break;
          case "s":
            THAT.setCommand("s");
            break;
          case "d":
            THAT.setCommand("N");
            break;
          case "q":
            THAT.setCommand("K");
            break;
          case "w":
            THAT.setCommand("F");
            break;
          case "e":
            THAT.setCommand("G");
            break;
          case "r":
            THAT.setCommand("C");
            break;
          case "t":
            THAT.setCommand("P");
            break;
          case "y":
            THAT.setCommand("T");
            break;
          case "z":
            THAT.setCommand("k");
            break;
          case "x":
            THAT.setCommand("f");
            break;
          case "c":
            THAT.setCommand("g");
            break;
          case "v":
            THAT.setCommand("c");
            break;
          case "b":
            THAT.setCommand("p");
            break;
          case "n":
            THAT.setCommand("t");
            break;
        }
      } else if (THAT.router.currentRoute._value.path == "/regional") {
        switch (event.key) {
          case "q":
            THAT.reCurrent();
            break;
          case "w":
            THAT.nextStyle();
            break;
          case "e":
            THAT.setCommand("s");
            setTimeout(() => {
              TIMER.doLap();
            }, 100);
            break;
          case "a":
            THAT.setStyleCommand(65);
            break;
          case "s":
            THAT.setStyleCommand(66);
            break;
          case "d":
            THAT.setStyleCommand(67);
            break;
          case "f":
            THAT.setStyleCommand(68);
            break;
          case "\\":
            TIMER.start();
            THAT.setCommand("s");
            break;
          case "z":
            TIMER.reset();
            break;
          case "x":
            TIMER.resume();
            break;
          case "c":
            TIMER.stop();
            break;
          case "v":
            TIMER.setToLocal();
            break;
        }
      }

      switch (event.key) {
        case " ":
          event.preventDefault();
          THAT.setCommand("S");
          LOGIC_UI_STATE.status_offset = false;
          LOGIC_UI_STATE.status_manual = false;
          LOGIC_UI_STATE.n_robot_manual = 0;
          THAT.ui_to_server.header_manual = false;
          THAT.ui_to_server.target_manual_x = 0;
          THAT.ui_to_server.target_manual_y = 0;
          THAT.ui_to_server.target_manual_theta = 0;
          break;
        case "i":
          THAT.offsetRobot(1);
          break;
        case "o":
          THAT.offsetRobot(2);
          break;
        case "p":
          THAT.offsetRobot(3);
          break;
        case "k":
          THAT.offsetRobot(4);
          break;
        case "l":
          THAT.offsetRobot(5);
          break;
        case "I":
          THAT.robotManual(1);
          break;
        case "O":
          THAT.robotManual(2);
          break;
        case "P":
          THAT.robotManual(3);
          break;
        case "K":
          THAT.robotManual(4);
          break;
        case "L":
          THAT.robotManual(5);
          break;
        case "[":
          THAT.decreaseTheta();
          break;
        case "]":
          THAT.increaseTheta();
          break;
        case "{":
          THAT.significantDecreaseTheta();
          break;
        case "}":
          THAT.significantIncreaseTheta();
          break;
        case ";":
          THAT.confirmOffset();
          break;
        case "Z":
          THAT.linkRobot(1);
          break;
        case "X":
          THAT.linkRobot(2);
          break;
        case "C":
          THAT.linkRobot(3);
          break;
        case "V":
          THAT.linkRobot(4);
          break;
        case "B":
          THAT.linkRobot(5);
          break;
        case "A":
          THAT.autoKalibrasi();
          break;
        case "|":
          LOGIC_UI_STATE.toggleMenu();
          break;
        case "R":
          LOGIC_UI_STATE.rotate_field = !LOGIC_UI_STATE.rotate_field;
          break;
      }
    },
  },
});

export const useRegionalTimer = defineStore({
  id: "regional-timer",
  state: () => ({
    // timer
    running: 0,
    pause: 0,
    time: 0,
    stopped: 0,
    minute: 0,
    second: 0,
    milis: 0,
    limit_param: 180, // in second
    laps: [],
    time_abc: [],
    total_play: [],
    lap_id: 1,
    cyc_id: 0,
    prosen: 0,
    // new
    epoch_start: null,
    epoch_elapsed: null,
    interval: null,
    dialog: false,
    snackbar_state: false,
    snackbar_text: "",
    ket_text: "",
  }),
  actions: {
    timer() {
      const THAT = this;
      THAT.interval = setInterval(() => {
        if (THAT.running) {
          THAT.time = Math.floor(Date.now() / 10 - THAT.epoch_start / 10);
          THAT.milis = THAT.place(THAT.time % 100);
          THAT.second = THAT.place(parseInt(THAT.time / 100) % 60);
          THAT.minute = THAT.place(parseInt(THAT.time / (60 * 100)));
          THAT.prosen = Math.ceil((THAT.time / 100 / THAT.limit_param) * 100);

          // Jika > 3menit = 180 detik
          // if (THAT.time >= THAT.limit_param * 100) THAT.stop();
        }
      }, 10);
    },
    start() {
      this.epoch_start = Date.now();
      this.running = 1;
      this.pause = 0;

      this.timer();
    },
    stop() {
      // this.doLap()
      this.running = 0;
      this.pause = 0;
      clearInterval(this.interval);
    },
    reset() {
      this.time = 0;
      this.running = 0;
      this.pause = 0;
      clearInterval(this.interval);
      this.laps = [];
      this.time_abc = [];
      this.prosen = 0;
      this.cyc_id = 0;
      this.total_play = [];
    },
    resume() {
      if (this.time == 0) this.start();
      this.running = 1;
      this.pause = 0;
      this.timer();
    },
    place(n) {
      return n < 10 ? "0" + n : n;
    },
    format(timeParam) {
      if (timeParam == 0) return "FIRST START";

      let localMilis = 0;
      let localSecond = 0;
      let localMinute = 0;
      localMilis = this.place(timeParam % 100);
      localSecond = this.place(parseInt(timeParam / 100) % 60);
      localMinute = this.place(parseInt(timeParam / (60 * 100)));

      return localMinute + ":" + localSecond + ":" + localMilis;
    },
    doLap() {
      const ROBOT_STATE = useRobot();
      if (this.time != 0 && this.running) {
        let tfz = 0;
        let tfb = 0;
        let tfbABC = 0;
        let tfzABC = 0;
        let mode = String.fromCharCode(ROBOT_STATE.ui_to_server.style);
        let modeConverted = "A";

        if (mode === "A") {
          // tfz = 'C: ' + this.format(this.time)
          // Add saving ABC Total Time
          tfbABC =
            this.time_abc.length >= 1
              ? this.format(
                  this.time - this.time_abc[this.time_abc.length - 1].timeValue
                )
              : this.format(this.time);
          tfzABC = this.format(this.time);

          this.time_abc.push({
            cyc_id: ++this.cyc_id,
            timeValue: this.time,
            timeFromZero: tfzABC,
            timeFromBefore: tfbABC,
          });

          // modeConverted = "C";
          modeConverted = "D";
        } else if (mode === "B") {
          modeConverted = "A";
        } else if (mode === "C") {
          modeConverted = "B";
        } else if (mode === "D") {
          modeConverted = "C";
        }

        tfb =
          this.laps.length >= 1
            ? this.format(this.time - this.laps[this.laps.length - 1].timeValue)
            : this.format(this.time);
        tfz = this.format(this.time);

        this.laps.push({
          id: this.lap_id++,
          timeValue: this.time,
          timeFromZero: modeConverted + ":" + tfz,
          timeFromBefore: "+" + tfb,
        });
        this.total_play.push(modeConverted);
      }
    },
    getFormattedDate() {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      let day = date.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      let hours = date.getHours();
      if (hours < 10) {
        hours = `0${hours}`;
      }
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    },
    countABC(sequence) {
      let count = 0;
      let lastChar = null;
      for (let i = 0; i < sequence.length; i++) {
        // const char = sequence.charAt(i);
        const char = sequence[i];
        if (char === "A" && lastChar !== "A") {
          count++;
        } else if (char === "B" && lastChar !== "B") {
          count++;
        } else if (char === "C" && lastChar !== "C") {
          count++;
        } else if (char === "D" && lastChar !== "D") {
          count++;
        }
        lastChar = char;
      }
      return count;
    },
    setToLocal() {
      let total = this.countABC(this.total_play);
      this.snackbar_text = "history timer saved";
      this.snackbar_state = true;
      const THAT = this;
      let data = [
        {
          date: new Date(),
          laps: THAT.laps,
          time_abc: THAT.time_abc,
          total_play: THAT.laps.length,
          total_goal: total,
        },
      ];
      let history_timer = [];

      if (localStorage.getItem("history_timer") == null) {
        localStorage.setItem("history_timer", JSON.stringify(data));
      } else {
        history_timer = localStorage.getItem("history_timer");
        history_timer = JSON.parse(history_timer);
        history_timer.push(data[0]);
        localStorage.setItem("history_timer", JSON.stringify(history_timer));
      }

      THAT.laps = [];
      THAT.time_abc = [];
      setTimeout(() => {
        THAT.snackbar_state = false;
        THAT.snackbar_text = "";
      }, 2000);
    },
  },
});

export const useSocketIO = defineStore({
  id: "socket-io",
  state: () => ({
    socket: null,
    emitter: {
      SERVER_TO_UI: "server2ui",
      UI_TO_SERVER: "ui2server",
      REFBOX: "refbox",
      AUTO_CMD: "auto_cmd",
    },
  }),
  actions: {
    setupSocketConnection() {
      if (Config.is_shareable) {
        this.socket = io(
          `http://${window.location.hostname}:${Config.port_web_socket}`
        );
      } else {
        this.socket = io(`http://localhost:${Config.port_web_socket}`);
      }
    },
    emitUIToServer(emitter, data) {
      const THAT = this;
      const EMITTER = emitter;
      const DATA = data;
      THAT.socket.emit(EMITTER, DATA);
    },
    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
  },
});
