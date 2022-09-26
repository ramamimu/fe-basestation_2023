import { io } from "socket.io-client";
import { defineStore } from "pinia";
import {
  PC2BS_DATA_ROBOT,
  SELF_ALONE_DATA_ROBOT,
  GLOBAL_DATA_SERVER,
  GLOBAL_DATA_UI,
  COMMAND_ROBOT,
} from "./utils";

import r1_img from "../assets/Model_IRIS_Basestaton/Green Model/green.png";
import r2_img from "../assets/Model_IRIS_Basestaton/Blue Model/blue.png";
import r3_img from "../assets/Model_IRIS_Basestaton/Pink Model/pink.png";
import r4_img from "../assets/Model_IRIS_Basestaton/Red Model/red.png";
import r5_img from "../assets/Model_IRIS_Basestaton/Yellow Model/yellow.png";
import r_offset from "../assets/robot_offset.png";

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

export const useLogicUI = defineStore({
  id: "logic-ui",
  state: () => ({
    toggle_menu: false,
    rotate_field: false,
    status_offset: false,
    status_manual: false,
    n_robot_manual: 0,
    n_robot_offset: 0,
  }),
  actions: {
    toggleMenu() {
      this.toggle_menu = !this.toggle_menu;
    },
    keyboardListener(key) {},
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
    ball_global_config: {},
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
    robot_image: [r1_img, r2_img, r3_img, r4_img, r5_img, r_offset],
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
  }),
  actions: {},
});

export const useRobot = defineStore({
  id: "robot",
  state: () => ({
    robot: [
      {
        self_data: SELF_ALONE_DATA_ROBOT,
        pc2bs_data: PC2BS_DATA_ROBOT,
      },
      {
        self_data: SELF_ALONE_DATA_ROBOT,
        pc2bs_data: PC2BS_DATA_ROBOT,
      },
      {
        self_data: SELF_ALONE_DATA_ROBOT,
        pc2bs_data: PC2BS_DATA_ROBOT,
      },
      {
        self_data: SELF_ALONE_DATA_ROBOT,
        pc2bs_data: PC2BS_DATA_ROBOT,
      },
      {
        self_data: SELF_ALONE_DATA_ROBOT,
        pc2bs_data: PC2BS_DATA_ROBOT,
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
  }),
  actions: {
    setCommand(command) {
      const THAT = this;
      THAT.ui_to_server.command =
        THAT.command_translattor[command].init.charCodeAt(0);
      setTimeout(() => {
        THAT.ui_to_server.command = command.charCodeAt(0);
      }, 150);
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
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.y = THAT.posYWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      } else {
        FIELD_STATE.robot_offset.x = THAT.posXNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.y = THAT.posYNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      }
    },
    robotManual(n_robot) {
      const THAT = this;
      const LOGIC_UI_STATE = useLogicUI();
      const FIELD_STATE = useField();
      const ROTATE_FIELD = LOGIC_UI_STATE.rotate_field;
      if (!LOGIC_UI_STATE.status_manual) {
        LOGIC_UI_STATE.status_manual = true;
        LOGIC_UI_STATE.n_robot_manual = n_robot;
        THAT.ui_to_server.header_manual = true;
        THAT.ui_to_server;
      }
      if (ROTATE_FIELD) {
        FIELD_STATE.robot_offset.x = THAT.posXWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.y = THAT.posYWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaWithRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      } else {
        FIELD_STATE.robot_offset.x = THAT.posXNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_x
        );
        FIELD_STATE.robot_offset.y = THAT.posYNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.pos_y
        );
        FIELD_STATE.robot_offset.rotation = THAT.thetaNoRotate(
          THAT.robot[n_robot - 1].pc2bs_data.theta
        );
      }
      THAT.ui_to_server.target_manual_x = 0;
      THAT.ui_to_server.target_manual_y = 0;
      THAT.ui_to_server.target_manual_theta = 0;
    },
    linkRobot(n_robot) {
      const THAT = this;
      if (this.ui_to_server.status_control_robot[n_robot - 1] === 1) {
        this.ui_to_server.status_control_robot[n_robot - 1] = 0;
      } else {
        this.ui_to_server.status_control_robot[n_robot - 1] = 1;
      }
    },
    decreaseTheta() {
      const LOGIC_UI_STATE = useLogicUI();
      const FIELD_STATE = useField();
      FIELD_STATE.robot_offset.rotation -= 2;
    },
    increaseTheta() {
      const FIELD_STATE = useField();
      const LOGIC_UI_STATE = useLogicUI();
      FIELD_STATE.robot_offset.rotation += 2;
    },
    significantDecreaseTheta() {
      const LOGIC_UI_STATE = useLogicUI();
      const FIELD_STATE = useField();
      FIELD_STATE.robot_offset.rotation -= 15;
    },
    significantIncreaseTheta() {
      const LOGIC_UI_STATE = useLogicUI();
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
          (
            THAT.returnTheta(FIELD_STATE.robot_offset.rotation) * -1
          ).toString() + n_robot.toString()
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

      return theta;
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
    keyboardListener(event) {
      const THAT = this;
      console.log(event, event.bubbles);
      switch (event.key) {
        case " ":
          event.preventDefault();
          // event.setter = false;
          THAT.setCommand("S");
          const LOGIC_UI_STATE = useLogicUI();
          LOGIC_UI_STATE.status_offset = false;
          LOGIC_UI_STATE.status_manual = false;
          this.ui_to_server.header_manual = false;
          THAT.ui_to_server.target_manual_x = 0;
          THAT.ui_to_server.target_manual_y = 0;
          THAT.ui_to_server.target_manual_theta = 0;
          break;
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
      }
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
    },
  }),
  actions: {
    setupSocketConnection() {
      this.socket = io(import.meta.env.VITE_ENV_SOCKET_ENDPOINT);
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
