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
      pub_topic: null,
      rob_topic: [null, null, null, null, null],
      cllction_topic: null,
      entity_robot: null,
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
  async beforeMount() {
    const THAT = this;
    const EMITTER = THAT.SOCKETIO_STATE.emitter;

    THAT.SOCKETIO_STATE.setupSocketConnection();
    if (Config.is_ros) {
      await this.initRos();
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

    THAT.SOCKETIO_STATE.socket.on(EMITTER.REFBOX, (data) => {
      THAT.ROBOT_STATE.refbox = { ...data };
      THAT.robotCommand();
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
  },
  methods: {
    async initRos() {
      const THAT = this;
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

      for (let i = 0; i < 5; i++) {
        const topic = `/pc2bs_r${i + 1}`;
        this.rob_topic[i] = await new ROSLIB.Topic({
          ros: this.ros,
          name: topic,
          messageType: "communications/PC2BS",
        });

        this.rob_topic[i].subscribe((message) => {
          this.ROBOT_STATE.robot[i].pc2bs_data = message;
        });
      }

      this.entity_robot = await new ROSLIB.Topic({
        ros: this.ros,
        name: "/entity_robot",
        messageType: "basestation/EntityRobot",
      });

      this.cllction_topic = await new ROSLIB.Topic({
        ros: this.ros,
        name: "/collection",
        messageType: "basestation/Collection",
      });

      this.pub_topic = await new ROSLIB.Topic({
        ros: this.ros,
        name: "/ui2server",
        messageType: "basestation/FE2BE",
      });

      this.entity_robot.subscribe((message) => {
        for (let i = 0; i < 5; i++) {
          THAT.ROBOT_STATE.robot[i].self_data.is_active = message.is_active[i];
          THAT.ROBOT_STATE.robot[i].self_data.n_robot_teman =
            message.n_robot_teman[i];
          THAT.ROBOT_STATE.robot[i].self_data.role = message.role[i];
          THAT.ROBOT_STATE.robot[i].self_data.bs_time_ = message.time_coming[i];

          const obs_msg_x = `obs_x_r${i + 1}`;
          const obs_msg_y = `obs_y_r${i + 1}`;
          const group_obs_msg_x = `group_${obs_msg_x}`;
          const group_obs_msg_y = `group_${obs_msg_y}`;

          THAT.ROBOT_STATE.robot[i].self_data.obs_x = message[obs_msg_x];
          THAT.ROBOT_STATE.robot[i].self_data.obs_y = message[obs_msg_y];
          THAT.ROBOT_STATE.robot[i].self_data.group_obs_x = [
            ...message[group_obs_msg_x],
          ];
          THAT.ROBOT_STATE.robot[i].self_data.group_obs_y = [
            ...message[group_obs_msg_y],
          ];
        }
      });

      this.cllction_topic.subscribe((message) => {
        this.ROBOT_STATE.global_data_server = message;
      });

      setInterval(() => {
        const msg = new ROSLIB.Message(this.ROBOT_STATE.ui_to_server);
        this.pub_topic.publish(msg);
      }, 10);
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
