<template>
  <div class="fix top-0 z-30 bg-slate-50">
    <div class="top-0 bg-[#cecece]">
      <img
        class="mx-auto cursor-pointer"
        @click="LOGIC_UI_STATE.toggleMenu()"
        data-tooltip-target="tooltip-default"
        src="./assets/header.png"
        alt=""
      />
    </div>
  </div>
  <div class="relative overflow-hidden bg-slate-50">
    <ToastVue v-if="TOAST_STATE.toast.status" />
    <Menu />
    <router-view />
  </div>
</template>

<script>
import { useLogicUI, useSocketIO, useRobot } from "./stores/store";
import { useToast } from "./stores/toast";
import { useRos } from "./stores/ros";
import Menu from "./views/Menu.vue";
import Config from "./config/setup.json";
import ToastVue from "./components/Toast.vue";
import "roslib/build/roslib";

export default {
  components: {
    Menu,
    ToastVue,
  },
  data() {
    return {
      menu: false,
      style_queue: ["D", "A", "E"],
      counter_style: 0,
    };
  },
  setup() {
    const LOGIC_UI_STATE = useLogicUI();
    const SOCKETIO_STATE = useSocketIO();
    const ROBOT_STATE = useRobot();
    const TOAST_STATE = useToast();
    const ROS_STATE = useRos();

    return {
      LOGIC_UI_STATE,
      SOCKETIO_STATE,
      ROBOT_STATE,
      TOAST_STATE,
      ROS_STATE,
    };
  },
  async beforeCreate() {
    const ROBOT = this.ROBOT_STATE.robot;
    ROBOT[0].ip = Config.ip_robot_1;
    ROBOT[1].ip = Config.ip_robot_2;
    ROBOT[2].ip = Config.ip_robot_3;
    ROBOT[3].ip = Config.ip_robot_4;
    ROBOT[4].ip = Config.ip_robot_5;

    this.LOGIC_UI_STATE.ip_refbox = Config.ip_refbox;
  },
  async beforeMount() {
    const THAT = this;
    const EMITTER = THAT.SOCKETIO_STATE.emitter;

    THAT.style_queue = Config.style_queue;

    THAT.SOCKETIO_STATE.setupSocketConnection();
    if (Config.is_ros) {
      await this.ROS_STATE.initRos();
    } else {
      THAT.SOCKETIO_STATE.socket.on(EMITTER.SERVER_TO_UI, (data) => {
        THAT.ROBOT_STATE.robot = [...data.robot];
        for (let i = 0; i < 5; i++) {
          THAT.ROBOT_STATE.robot[i].pc2bs_data = data.robot[i].pc2bs_data;
          THAT.ROBOT_STATE.robot[i].self_data = data.robot[i].self_data;
        }
        THAT.ROBOT_STATE.global_data_server = { ...data.global_data_server };
      });
      THAT.SOCKETIO_STATE.socket.on(EMITTER.REFBOX, (data) => {
        THAT.ROBOT_STATE.refbox = { ...data };
        THAT.robotCommand();
      });
    }
  },
  mounted() {
    const THAT = this;
    const EMITTER = THAT.SOCKETIO_STATE.emitter;

    THAT.addCounterStyle(0);

    THAT.SOCKETIO_STATE.socket.on(EMITTER.REFBOX, (data) => {
      THAT.ROBOT_STATE.refbox = { ...data };
      THAT.robotCommand();

      const REFBOX = THAT.ROBOT_STATE.refbox;
      // Style A (65): Umpan dan defender boleh maju (penerimaan di kiri atau kanan dengan y sejajar)
      // Style B (66): Ambil  bola langsung tendang
      // Style C (67): Paling safety, defender belakang, att tanpa umpan, att tanpa meluruskan obs lawan saat merebur
      // Style D (68): defender maju, att maju, tanpa umpan
      // Style E (69): Dynamis Positioning untuk posisi umpan dan penerima
      if (
        REFBOX.status &&
        (REFBOX.message.command == "GOAL+" || REFBOX.message.command == "GOAL-")
      ) {
        let home_goal = REFBOX.message.goal.home_goal;
        let away_goal = REFBOX.message.goal.away_goal;
        let diff = home_goal - away_goal;

        // D A E
        THAT.addCounterStyle(diff);
      }
    });

    window.addEventListener("keypress", THAT.ROBOT_STATE.keyboardListener);
    window.addEventListener("keydown", (event) => {
      if (event.code == "CapsLock") {
        if (event.getModifierState("CapsLock")) {
          THAT.LOGIC_UI_STATE.capslock = !THAT.LOGIC_UI_STATE.capslock;
        } else {
          THAT.LOGIC_UI_STATE.capslock = true;
        }
      }
    });

    THAT.$router.push(Config.starting_endpoint);
  },
  created() {
    window.addEventListener("beforeunload", this.disableReload);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.disableReload);
  },
  methods: {
    addCounterStyle(diff) {
      console.log(diff);
      const THAT = this;
      const UI_TO_SERVER = THAT.ROBOT_STATE.ui_to_server;
      const LEN_STYLE = THAT.style_queue.length;
      const IS_STYLE_CHANGE = THAT.LOGIC_UI_STATE.is_style_change;

      if (IS_STYLE_CHANGE) {
        // const index = diff / LEN_STYLE;
        // UI_TO_SERVER.style =
        //   index > LEN_STYLE - 1
        //   // index > 3
        //     ? UI_TO_SERVER.style
        //     : THAT.style_queue[index].charCodeAt(0);

        // per 1: robot mati
        if (diff >= 2) {
          UI_TO_SERVER.style = THAT.style_queue[2].charCodeAt(0);
        } else if (diff >= 1) {
          UI_TO_SERVER.style = THAT.style_queue[1].charCodeAt(0);
        } else {
          UI_TO_SERVER.style = THAT.style_queue[0].charCodeAt(0);
        }

        // per 2
        // if (diff >= 3) {
        //   UI_TO_SERVER.style = THAT.style_queue[2].charCodeAt(0);
        // } else if (diff >= 2) {
        //   UI_TO_SERVER.style = THAT.style_queue[1].charCodeAt(0);
        // } else {
        //   UI_TO_SERVER.style = THAT.style_queue[0].charCodeAt(0);
        // }
      }
    },
    disableReload(event) {
      if (Config.is_nasional) {
        event.preventDefault();
        event.returnValue = "";
      }
    },
    robotCommand() {
      const THAT = this;
      let refbox = THAT.ROBOT_STATE.refbox;
      let overrid_mode = THAT.LOGIC_UI_STATE.override_mode;
      let command = refbox.message.command;
      let target = refbox.message.targetTeam;

      if (refbox.status && !overrid_mode) {
        let translattorCommand = THAT.translateCommand(command);
        if (translattorCommand) {
          if (
            target == Config.group_multicast ||
            target == "" ||
            target == "ALL" ||
            target == "HOME"
          ) {
            THAT.ROBOT_STATE.setCommand(translattorCommand);
          } else {
            THAT.ROBOT_STATE.setCommand(translattorCommand.toLowerCase());
          }
        }
      }
    },
    translateCommand(command) {
      let string_command = "";
      if (command == "START") {
        string_command = "s";
      } else if (command == "STOP") {
        string_command = "S";
      } else if (command == "DROP_BALL") {
        string_command = "N";
      } else if (command == "PARK") {
        string_command = "L";
      } else if (command == "KALIBRASI") {
        string_command = "#";
      }
      //== Command untuk masing2 Tim
      else {
        if (command == "KICKOFF") {
          string_command = "K";
        } else if (command == "FREEKICK") {
          string_command = "F";
        } else if (command == "GOALKICK") {
          string_command = "G";
        } else if (command == "THROWIN") {
          string_command = "T";
        } else if (command == "CORNER") {
          string_command = "C";
        } else if (command == "PENALTY") {
          string_command = "P";
        }
      }
      return string_command;
    },
  },
  watch: {
    ROBOT_STATE: {
      handler() {
        const THAT = this;
        const EMITTER = THAT.SOCKETIO_STATE.emitter;
        const UI_TO_SERVER = THAT.ROBOT_STATE.ui_to_server;

        for (let i = 0; i < 5; i++) {
          THAT.ROBOT_STATE.ui_to_server.trim_kecepatan_robot[i] = parseInt(
            THAT.ROBOT_STATE.ui_to_server.trim_kecepatan_robot[i]
          );
          THAT.ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[i] =
            parseInt(
              THAT.ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[i]
            );
          THAT.ROBOT_STATE.ui_to_server.trim_penendang_robot[i] = parseInt(
            THAT.ROBOT_STATE.ui_to_server.trim_penendang_robot[i]
          );
        }

        if (THAT.LOGIC_UI_STATE.is_share_to_ui) {
          THAT.SOCKETIO_STATE.emitUIToServer(
            EMITTER.UI_TO_SERVER,
            UI_TO_SERVER
          );
        }
      },
      deep: true,
    },
    "ROBOT_STATE.obs_num": {
      handler() {
        const THAT = this;
        let obstacle = JSON.stringify(THAT.ROBOT_STATE.obs_num);
        localStorage.setItem("obstacle", obstacle);
      },
      deep: true,
    },
  },
};
</script>
