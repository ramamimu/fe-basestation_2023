<template>
  <div bottom style="background-color: rgb(206, 206, 206)">
    <v-tooltip>
      <template v-slot:activator="{ attrs }">
        <v-img
          alt="Vuetify Logo"
          src="../src/assets/header.png"
          transition="scale-transition"
          width="100%"
          max-height="104"
          style="cursor: pointer"
          v-bind="attrs"
          contain
          @click.stop="LOGIC_UI_STATE.toggleMenu()"
        />
      </template>
      <span>CLICK TO OPEN MENU</span>
    </v-tooltip>
    <v-app>
      <v-navigation-drawer
        v-model="LOGIC_UI_STATE.toggle_menu"
        absolute
        temporary
      >
        <Menu />
      </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-main>
    </v-app>
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
    });

    window.addEventListener("keypress", THAT.ROBOT_STATE.keyboardListener);
  },
  watch: {
    "ROBOT_STATE.ui_to_server": {
      handler() {
        const THAT = this;
        const EMITTER = THAT.SOCKETIO_STATE.emitter;
        const UI_TO_SERVER = THAT.ROBOT_STATE.ui_to_server;
        THAT.SOCKETIO_STATE.emitUIToServer(EMITTER.UI_TO_SERVER, UI_TO_SERVER);
      },
      deep: true,
    },
  },
};
</script>
