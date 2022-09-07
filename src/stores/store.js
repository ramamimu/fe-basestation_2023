import { io } from "socket.io-client";

import { defineStore } from "pinia";
import {
  PC2BS_DATA_ROBOT,
  BS2PC_DATA_ROBOT,
  GLOBAL_DATA_UI,
  COMMAND_ROBOT,
} from "./utils";

export const useLogicUI = defineStore({
  id: "logic-ui",
  state: () => ({
    toggle_menu: false,
    rotate_field: false,
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
  }),
});

export const useRobot = defineStore({
  id: "robot",
  state: () => ({
    robot: [
      {
        is_active: false,
        bs2pc_data: { ...BS2PC_DATA_ROBOT },
        pc2bs_data: { ...PC2BS_DATA_ROBOT },
      },
      {
        is_active: false,
        bs2pc_data: { ...BS2PC_DATA_ROBOT },
        pc2bs_data: { ...PC2BS_DATA_ROBOT },
      },
      {
        is_active: false,
        bs2pc_data: { ...BS2PC_DATA_ROBOT },
        pc2bs_data: { ...PC2BS_DATA_ROBOT },
      },
      {
        is_active: false,
        bs2pc_data: { ...BS2PC_DATA_ROBOT },
        pc2bs_data: { ...PC2BS_DATA_ROBOT },
      },
      {
        is_active: false,
        bs2pc_data: { ...BS2PC_DATA_ROBOT },
        pc2bs_data: { ...PC2BS_DATA_ROBOT },
      },
    ],
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
