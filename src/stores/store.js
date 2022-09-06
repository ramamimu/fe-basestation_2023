import { defineStore } from "pinia";
import { BS2PC_DATA_ROBOT, GLOBAL_DATA_UI } from "@/stores/utils";

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

export const useDataFromServer = defineStore({});

export const useDataToServer = defineStore({});

export const useRobotData = defineStore({
  id: "robot",
  state: () => ({
    robot: [
      { ...BS2PC_DATA_ROBOT },
      { ...BS2PC_DATA_ROBOT },
      { ...BS2PC_DATA_ROBOT },
      { ...BS2PC_DATA_ROBOT },
      { ...BS2PC_DATA_ROBOT },
    ],
  }),
});

export const useUIToServerData = defineStore({
  id: "ui",
  state: () => ({
    ui: {
      ...GLOBAL_DATA_UI,
    },
  }),
});
