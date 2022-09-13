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
    robot_config: [
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
    dummy_robot_config: {
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
    robot_image: [r1_img, r2_img, r3_img, r4_img, r5_img],
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
      if (!LOGIC_UI_STATE.status_offset) {
        LOGIC_UI_STATE.status_offset = true;
        LOGIC_UI_STATE.n_robot_offset = n_robot;
      } else {
        THAT.ui_to_server.odometry_offset_robot_x = FIELD_STATE.mouse_pointer_x;
        THAT.ui_to_server.odometry_offset_robot_y = FIELD_STATE.mouse_pointer_y;
        setTimeout(() => {
          LOGIC_UI_STATE.status_offset = false;
          LOGIC_UI_STATE.n_robot_offset = 0;
          THAT.ui_to_server.odometry_offset_robot_x = 0;
          THAT.ui_to_server.odometry_offset_robot_y = 0;
          FIELD_STATE.mouse_pointer_x = 0;
          FIELD_STATE.mouse_pointer_y = 0;
        }, 5000);
      }
    },
    keyboardListener(event) {
      const THAT = this;
      switch (event.key) {
        case " ":
          event.preventDefault();
          THAT.setCommand("S");
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
        case "p":
          THAT.offsetRobot(1);
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
      // console.log(DATA.header);
      THAT.socket.emit(EMITTER, DATA);
    },
    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
  },
});
