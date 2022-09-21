<template>
  <div style="background-color: rgb(206, 206, 206)">
    <router-view />

    <br />
    <h2>Robot 1</h2>
    <p>{{ ROBOT_STATE.robot[0] }}</p>
    <h2>Robot 2</h2>
    <p>{{ ROBOT_STATE.robot[1] }}</p>
    <h2>Robot 3</h2>
    <p>{{ ROBOT_STATE.robot[2] }}</p>
    <h2>Robot 4</h2>
    <p>{{ ROBOT_STATE.robot[3] }}</p>
    <h2>Robot 5</h2>
    <p>{{ ROBOT_STATE.robot[4] }}</p>
    <h2>GLOBAL DATA SERVER</h2>
    <p>{{ ROBOT_STATE.global_data_server }}</p>
    <h2>GLOBAL DATA FROM UI</h2>
    <p>{{ ROBOT_STATE.ui_to_server }}</p>
    <h2>GENERAL DATA</h2>
    <p>{{ ROBOT_STATE.robot }}</p>
  </div>
</template>

<script>
import { useLogicUI, useSocketIO, useRobot } from "./stores/store";
import Menu from "./views/Menu.vue";

export default {
  components: {
    Menu,
  },
  setup() {
    const LOGIC_UI_STATE = useLogicUI();
    const SOCKETIO_STATE = useSocketIO();
    const ROBOT_STATE = useRobot();
    return {
      LOGIC_UI_STATE,
      SOCKETIO_STATE,
      ROBOT_STATE,
    };
  },
  created() {
    const THAT = this;
    THAT.SOCKETIO_STATE.setupSocketConnection();
  },
  mounted() {
    const THAT = this;
    const EMITTER = THAT.SOCKETIO_STATE.emitter;
    THAT.SOCKETIO_STATE.socket.on(EMITTER.SERVER_TO_UI, (data) => {
      THAT.ROBOT_STATE.robot = [...data.robot];
      THAT.ROBOT_STATE.global_data_server = { ...data.global_data_server };
    });

    window.addEventListener("keypress", THAT.ROBOT_STATE.keyboardListener);
  },
  watch: {
    ROBOT_STATE: {
      handler() {
        const THAT = this;
        const EMITTER = THAT.SOCKETIO_STATE.emitter;
        const UI_TO_SERVER = THAT.ROBOT_STATE.ui_to_server;
        const LEN_ROBOT = THAT.ROBOT_STATE.robot.length;
        for (let i = 0; i < LEN_ROBOT; i++) {
          UI_TO_SERVER.trim_kecepatan_robot[i] = Math.floor(
            UI_TO_SERVER.trim_kecepatan_robot[i]
          );
          UI_TO_SERVER.trim_kecepatan_sudut_robot[i] = Math.floor(
            UI_TO_SERVER.trim_kecepatan_sudut_robot[i]
          );
          UI_TO_SERVER.trim_penendang_robot[i] = Math.floor(
            UI_TO_SERVER.trim_penendang_robot[i]
          );
        }

        THAT.SOCKETIO_STATE.emitUIToServer(EMITTER.UI_TO_SERVER, UI_TO_SERVER);
      },
      deep: true,
    },
  },
};
</script>
