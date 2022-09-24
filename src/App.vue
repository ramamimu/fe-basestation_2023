<template>
  <div
    class="fixed z-50 mt-32 grid h-screen w-screen grid-cols-12 grid-rows-6"
    v-if="menu"
  >
    <div
      class="col-span-2 row-span-full h-screen place-content-start bg-white pt-2"
    >
      <div class="mb-2 flex pl-3 text-2xl">
        <img src="./assets/iris-icon.png" class="mr-3 h-10" alt="" />
        IRIS Basestation
      </div>
      <div class="flex flex-col">
        <div class="cursor-pointer py-2 pl-6 hover:bg-slate-200">Regional</div>
        <div class="cursor-pointer py-2 pl-6 hover:bg-slate-200">Nasional</div>
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
      @click="toggleMenu()"
    ></div>
  </div>
  <div class="bg-slate-50">
    <div class="bg-[#cecece]">
      <img
        class="mx-auto cursor-pointer"
        @click="toggleMenu()"
        data-tooltip-target="tooltip-default"
        src="./assets/header.png"
        alt=""
      />
      <!-- <div id="tooltip-default" role="tooltip" class="inline-block fixed invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
    Tooltip content
    <div class="tooltip-arrow" data-popper-arrow></div>
</div> -->
    </div>
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
  data() {
    return {
      menu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menu = !this.menu;
    },
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
