<template>
  <div class="bg-slate-50 sticky top-0 z-30">
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
  <div
    class="fixed z-50 grid h-screen w-screen grid-cols-12 grid-rows-6"
    v-if="LOGIC_UI_STATE.toggle_menu"
  >
    <div
      class="col-span-2 row-span-full h-screen place-content-start bg-white pt-2"
    >
      <div class="mb-2 flex pl-3 text-2xl">
        <img src="./assets/iris-icon.png" class="mr-3 h-10" alt="" />
        IRIS Basestation
      </div>
      <div class="flex flex-col">
        <router-link to="/regional">
          <div
            class="cursor-pointer py-2 pl-6 hover:bg-slate-200"
            :class="{
              'bg-slate-300':
                $router.currentRoute._value.fullPath == `/regional`,
            }"
          >
            Regional
          </div>
        </router-link>
        <router-link to="/">
          <div
            class="cursor-pointer py-2 pl-6 hover:bg-slate-200"
            :class="{
              'bg-slate-300': $router.currentRoute._value.fullPath == `/`,
            }"
          >
            Nasional
          </div>
        </router-link>
        <div class="cursor-pointer py-2 pl-6 hover:bg-slate-200">Robocup</div>
      </div>
      <div class="pl-3">
        <button
          type="button"
          class="my-3 rounded-lg border border-gray-200 bg-blue-600 py-2.5 px-14 text-lg font-medium text-white hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
        >
          Status Control Robot
        </button>
      </div>
      <!-- for toogle -->
      <div class="mt-1 pl-3">
        <div>
          <label
            for="rotate-field"
            class="relative inline-flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              v-model="LOGIC_UI_STATE.rotate_field"
              id="rotate-field"
              class="peer sr-only"
            />
            <div class="toggle peer"></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Rotate Field</span
            >
          </label>
        </div>
        <div>
          <label
            for="is-multicast"
            class="relative inline-flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              v-model="ROBOT_STATE.ui_to_server.is_multicast"
              id="is-multicast"
              class="peer sr-only"
            />
            <div class="toggle peer"></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >multicast</span
            >
          </label>
        </div>
        <!-- <div>
          <label
            for="connect-refbox"
            class="inline-flex relative items-center cursor-pointer"
          >
            <input
              type="checkbox"
              value=""
              id="connect-refbox"
              class="sr-only peer"
            />
            <div class="toggle peer"></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Connect Refbox</span
            >
          </label>
        </div>
        <div>
          <label
            for="override-mode"
            class="inline-flex relative items-center cursor-pointer"
          >
            <input
              type="checkbox"
              value=""
              id="override-mode"
              class="sr-only peer"
            />
            <div class="toggle peer"></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Override Mode</span
            >
          </label>
        </div>
        <div>
          <label
            for="shootline-mode"
            class="inline-flex relative items-center cursor-pointer"
          >
            <input
              type="checkbox"
              value=""
              id="shootline-mode"
              class="sr-only peer"
            />
            <div class="toggle peer"></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Shootline Mode</span
            >
          </label>
        </div>
        <div>
          <label
            for="ball-global"
            class="inline-flex relative items-center cursor-pointer"
          >
            <input
              type="checkbox"
              value=""
              id="ball-global"
              class="sr-only peer"
            />
            <div class="toggle peer"></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Ball Global</span
            >
          </label>
        </div> -->
      </div>
    </div>
    <div
      class="col-span-10 row-span-full bg-black opacity-30"
      @click="LOGIC_UI_STATE.toggleMenu()"
    ></div>
  </div>
  <div class="bg-slate-50">
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
import Config from "./config/setup.json";

export default {
  components: {
    Menu,
  },
  data() {
    return {
      menu: false,
    };
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
    THAT.SOCKETIO_STATE.socket.on(EMITTER.REFBOX, (data) => {
      THAT.ROBOT_STATE.refbox = { ...data };
      console.log(data);
      THAT.robotCommand();
    });

    window.addEventListener("keypress", THAT.ROBOT_STATE.keyboardListener);
    window.addEventListener("keyup", (event) => {
      if (event.getModifierState("CapsLock")) {
        THAT.LOGIC_UI_STATE.capslock = true;
      } else {
        THAT.LOGIC_UI_STATE.capslock = false;
      }
    });
  },
  methods: {
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

        THAT.SOCKETIO_STATE.emitUIToServer(EMITTER.UI_TO_SERVER, UI_TO_SERVER);
      },
      deep: true,
    },
    $router: {
      handler() {
        console.log(this.$router.currentRoute._value.fullPath);
      },
      deep: true,
    },
  },
};
</script>
