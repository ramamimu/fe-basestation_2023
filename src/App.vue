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
      ros: null,
      sub_topic: null,
      pub_topic: null,
    };
  },
  setup() {
    const LOGIC_UI_STATE = useLogicUI();
    const SOCKETIO_STATE = useSocketIO();
    const ROBOT_STATE = useRobot();
    const TOAST_STATE = useToast();
    return {
      LOGIC_UI_STATE,
      SOCKETIO_STATE,
      ROBOT_STATE,
      TOAST_STATE,
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
  created() {
    // const THAT = this;
    // THAT.SOCKETIO_STATE.setupSocketConnection();
  },
  async beforeMount() {
    await this.initRos();
  },
  mounted() {
    const THAT = this;
    // const EMITTER = THAT.SOCKETIO_STATE.emitter;
    // THAT.SOCKETIO_STATE.socket.on(EMITTER.SERVER_TO_UI, (data) => {
    //   THAT.ROBOT_STATE.robot = [...data.robot];
    //   THAT.ROBOT_STATE.global_data_server = { ...data.global_data_server };
    // });
    // THAT.SOCKETIO_STATE.socket.on(EMITTER.REFBOX, (data) => {
    //   THAT.ROBOT_STATE.refbox = { ...data };
    //   THAT.robotCommand();
    // });

    window.addEventListener("keypress", THAT.ROBOT_STATE.keyboardListener);
    window.addEventListener("keyup", (event) => {
      if (event.code == "CapsLock") {
        if (event.getModifierState("CapsLock")) {
          THAT.LOGIC_UI_STATE.capslock = true;
        } else {
          THAT.LOGIC_UI_STATE.capslock = !THAT.LOGIC_UI_STATE.capslock;
        }
      }
    });
  },
  methods: {
    async initRos() {
      this.ros = await new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });
      this.ros.on("connection", () => {
        console.log("Connected to websocket server.");
      });

      this.ros.on("error", (error) => {
        console.log("Error connecting to websocket server: ", error);
      });

      this.ros.on("close", () => {
        console.log("Connection to websocket server closed.");
      });

      this.sub_topic = await new ROSLIB.Topic({
        ros: this.ros,
        name: "/topic_chatter",
        messageType: "talker_listener/Message",
      });

      this.sub_topic.subscribe((message) => {
        // console.log(
        //   "Received message on " + this.sub_topic.name + ": " + message
        // );
        console.log(message);
      });
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
          if (target == Config.group_multicast || target == "") {
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

        if (THAT.LOGIC_UI_STATE.is_share_to_ui) {
          THAT.SOCKETIO_STATE.emitUIToServer(
            EMITTER.UI_TO_SERVER,
            UI_TO_SERVER
          );
        }
      },
      deep: true,
    },
  },
};
</script>
